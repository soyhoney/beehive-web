/**
 * 비하이브코퍼레이션 견적 문의 접수 — Google Apps Script
 *
 * 하는 일
 *  1. 접수번호(BH-YYYYMMDD-NNNN)를 발급합니다.
 *  2. "전체" 탭에 공통 컬럼으로 한 줄 쌓습니다.        → 클라이언트 DB · 영업 현황
 *  3. 구분별 탭(동행·수행 출장 등)에 상세 문항을 쌓습니다. → 구분별 데이터베이스
 *  4. 고객에게 접수 확인 메일을, 담당자에게 알림 메일을 보냅니다.
 *
 * 설치 방법은 apps-script/README.md 를 참고하세요.
 *
 * 컬럼 헤더는 웹사이트가 보내온 키를 그대로 씁니다.
 * 문항이 늘어나면 헤더 끝에 새 컬럼이 자동으로 추가되므로,
 * 폼을 고쳐도 이 파일을 손댈 필요가 없고 기존 데이터도 밀리지 않습니다.
 */

// ===== 설정 =========================================================
/**
 * 데이터를 쌓을 구글 시트 ID.
 * 시트 주소의 /d/ 와 /edit 사이 문자열입니다.
 *   https://docs.google.com/spreadsheets/d/<이 부분>/edit
 *
 * 빈 문자열로 두면 이 스크립트가 붙어 있는 시트에 쌓습니다.
 */
const SHEET_ID = "1YPBa-A5qQlGe3L3NvXv0ONZzpuWLMhz6BuFm7Tjar3k";

/** 접수 알림을 받을 내부 담당자 주소. 쉼표로 여러 명 지정 가능. */
const NOTIFY_TO = "service@beehivecorp.co.kr";
/** 고객에게 보내는 메일의 발신자 표시 이름 */
const SENDER_NAME = "비하이브코퍼레이션";
/** 모든 문의가 모이는 탭 이름 */
const ALL_SHEET = "전체";
/**
 * 언니가 사이트에 노출할 콘텐츠를 관리하는 탭들.
 * 스키마는 docs/CONTENT-SHEETS.md 참고.
 *
 *   notices      — 공지사항. A 번호 · B 뱃지("공지"/"안내") · C 제목 · D 본문 · E 등록일
 *   posts        — 소식(블로그). A 번호 · B 제목 · C 블로그URL · D 등록일
 *   testimonials — 고객 후기. A 번호 · B 공개(체크박스) · C 성함 · D 직함 · E 소속 · F 후기 · G 등록일
 */
const NOTICES_SHEET = "notices";
const POSTS_SHEET = "posts";
/**
 * 고객 후기 탭.
 *   A 번호 · B 공개(체크박스) · C 성함 · D 직함 · E 소속 · F 후기 · G 등록일
 * 공개 체크가 켜진 행만 사이트에 노출됩니다.
 */
const TESTIMONIALS_SHEET = "testimonials";
/**
 * 첨부파일이 저장될 구글 드라이브 폴더 ID.
 * 폴더 URL의 /folders/ 뒤 문자열입니다.
 *   https://drive.google.com/drive/folders/<이 부분>
 */
const DRIVE_FOLDER_ID = "1aTOswvZYbZMxVwfdexIvHXa2DESnkcHd";
// ====================================================================

/** 데이터를 쌓을 스프레드시트를 연다. */
function book_() {
  return SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
}

function doPost(e) {
  // 동시 접수 시 접수번호가 겹치지 않도록 잠금
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const payload = JSON.parse(e.postData.contents);
    const common = payload.common || {};
    const detail = payload.detail || {};
    const categoryLabel = payload.categoryLabel || "미분류";

    // 최소 검증: 연락처가 없으면 접수로 보지 않는다.
    if (!common["이메일"] || !common["담당자명"]) {
      return json_({ ok: false, error: "필수 정보가 누락되었습니다." });
    }

    const book = book_();
    const refNo = nextRefNo_(book);

    common["접수번호"] = refNo;
    detail["접수번호"] = refNo;

    // 첨부파일: 메일에 붙일 Blob을 먼저 만들고, 드라이브 보관은 되면 하고 안 되면 건너뛴다.
    const blobs = toBlobs_(payload.files);
    const saved = saveToDrive_(refNo, blobs);

    // 드라이브에 보관됐을 때만 시트의 파일명을 링크로 바꿔준다.
    if (saved.length) {
      common["첨부파일"] = linkList_(saved);

      Object.keys(detail).forEach(function (key) {
        if (key.indexOf("— 첨부") === -1) return;
        const names = String(detail[key] || "")
          .split(",")
          .map(function (n) {
            return n.trim();
          })
          .filter(Boolean);
        const matched = saved.filter(function (f) {
          return names.indexOf(f.name) !== -1;
        });
        if (matched.length) detail[key] = linkList_(matched);
      });
    }

    // 1) 전체 탭
    appendRow_(book, ALL_SHEET, common, ["RAW_JSON"]);
    // 2) 구분별 탭
    appendRow_(book, sheetNameFor_(categoryLabel), detail, []);

    // 메일 발송이 실패해도 접수 자체는 성공으로 처리한다.
    try {
      notifyStaff_(refNo, common, detail, book.getUrl(), blobs);
      confirmToCustomer_(refNo, common, payload.raw || {});
    } catch (mailError) {
      console.error("메일 발송 실패: " + mailError);
    }

    return json_({ ok: true, refNo: refNo });
  } catch (error) {
    console.error(error);
    // error는 고객 화면에 그대로 노출되므로 일반 문구를 유지하고,
    // 원인 파악용 메시지는 detail 에 따로 담는다. (웹사이트는 detail을 읽지 않는다)
    return json_({
      ok: false,
      error: "접수 처리 중 오류가 발생했습니다.",
      detail: String((error && error.message) || error),
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * GET 엔드포인트.
 * - `?type=notices` : 공지사항 목록
 * - `?type=posts`   : 소식(블로그) 목록
 * - 그 외           : 동작 확인용 상태 응답
 */
function doGet(e) {
  const params = (e && e.parameter) || {};
  if (params.type === "notices") return json_(listNotices_());
  if (params.type === "posts") return json_(listPosts_());
  if (params.type === "testimonials") return json_(listTestimonials_());
  return json_({ ok: true, service: "beehive-quote-intake" });
}

/**
 * 콘텐츠 탭(notices · posts · testimonials) 초기 셋업.
 * Apps Script 편집기에서 이 함수를 한 번 실행하면 세 개의 탭이 자동으로 만들어지고,
 * 드롭다운 · 체크박스 · 헤더 · 서식이 적용됩니다. 이미 존재하는 탭은 건드리지 않습니다.
 */
function setupContentSheets() {
  const book = book_();

  setupSheet_(book, NOTICES_SHEET, {
    headers: ["번호", "뱃지", "제목", "본문", "등록일"],
    // B열: "공지" / "안내" 드롭다운. 언니가 직접 텍스트로 골라 넣습니다.
    dropdownColumns: { 2: ["공지", "안내"] },
    columnWidths: { 2: 80, 3: 320, 4: 480, 5: 110 },
  });

  setupSheet_(book, POSTS_SHEET, {
    headers: ["번호", "제목", "블로그URL", "등록일"],
    columnWidths: { 2: 320, 3: 400, 4: 110 },
  });

  setupSheet_(book, TESTIMONIALS_SHEET, {
    headers: ["번호", "공개", "성함", "직함", "소속", "후기", "등록일"],
    checkboxColumns: [2], // B열: 공개 여부
    columnWidths: { 3: 110, 4: 140, 5: 180, 6: 480, 7: 110 },
  });
}

/**
 * 시트 한 개를 원하는 헤더/체크박스/드롭다운/컬럼폭으로 세팅한다.
 * 이미 있으면 건드리지 않고, 없을 때만 새로 만든다.
 */
function setupSheet_(book, name, config) {
  const existing = book.getSheetByName(name);
  if (existing && existing.getLastRow() > 0) return; // 이미 사용 중이면 손대지 않음

  const sheet = existing || book.insertSheet(name);

  sheet
    .getRange(1, 1, 1, config.headers.length)
    .setValues([config.headers])
    .setFontWeight("bold")
    .setBackground("#f1f3f4");
  sheet.setFrozenRows(1);

  (config.checkboxColumns || []).forEach(function (col) {
    sheet.getRange(2, col, 999, 1).insertCheckboxes();
  });

  // 드롭다운 데이터 유효성: 정해진 값 중에서만 고를 수 있도록 강제
  Object.keys(config.dropdownColumns || {}).forEach(function (col) {
    const options = config.dropdownColumns[col];
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(options, true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange(2, Number(col), 999, 1).setDataValidation(rule);
  });

  Object.keys(config.columnWidths || {}).forEach(function (col) {
    sheet.setColumnWidth(Number(col), config.columnWidths[col]);
  });
}

function json_(object) {
  return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/**
 * 공지사항 목록을 읽어 배열로 돌려준다.
 * 제목이 비어 있는 행은 무시하며, "공지" 뱃지 행이 위로 오도록 정렬한다.
 *
 * B열은 언니가 "공지" 또는 "안내" 텍스트를 직접 입력합니다.
 * 하위호환으로 체크박스(TRUE=공지 / FALSE=안내)도 여전히 인식합니다.
 */
function listNotices_() {
  const book = book_();
  const sheet = book.getSheetByName(NOTICES_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return { ok: true, items: [] };

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
  const items = rows
    .filter(function (row) {
      return String(row[2] || "").trim().length > 0;
    })
    .map(function (row) {
      return {
        id: String(row[0] || "").trim(),
        kind: normalizeKind_(row[1]),
        title: String(row[2] || "").trim(),
        body: String(row[3] || "").trim(),
        date: formatNoticeDate_(row[4]),
      };
    });

  // 최신 등록일 우선, "공지"는 다시 위로.
  items.sort(function (a, b) {
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });
  items.sort(function (a, b) {
    const pa = a.kind === "공지" ? 0 : 1;
    const pb = b.kind === "공지" ? 0 : 1;
    return pa - pb;
  });

  return { ok: true, items: items };
}

/**
 * B열 값을 뱃지 라벨로 정규화한다.
 * - "공지" / "안내" 텍스트는 그대로
 * - 체크박스 TRUE는 "공지", FALSE·빈 값은 "안내"
 */
function normalizeKind_(value) {
  if (value === true) return "공지";
  if (value === false) return "안내";
  const text = String(value || "").trim();
  if (text === "공지") return "공지";
  if (text === "안내") return "안내";
  return "안내";
}

/**
 * 고객 후기 목록.
 * 공개 체크박스(B열)가 켜진 행만 노출한다. 후기 본문(F열)이 비어 있으면 무시.
 * 등록일(G열) 최신순으로 정렬.
 */
function listTestimonials_() {
  const book = book_();
  const sheet = book.getSheetByName(TESTIMONIALS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return { ok: true, items: [] };

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues();
  const items = rows
    .filter(function (row) {
      const published = row[1] === true || String(row[1]).toLowerCase() === "true";
      const hasReview = String(row[5] || "").trim().length > 0;
      return published && hasReview;
    })
    .map(function (row) {
      return {
        id: String(row[0] || "").trim(),
        name: String(row[2] || "").trim(),
        title: String(row[3] || "").trim(),
        affiliation: String(row[4] || "").trim(),
        review: String(row[5] || "").trim(),
        date: formatNoticeDate_(row[6]),
      };
    });

  items.sort(function (a, b) {
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });

  return { ok: true, items: items };
}

function formatNoticeDate_(value) {
  if (!value) return "";
  if (value instanceof Date) {
    return Utilities.formatDate(value, "Asia/Seoul", "yyyy-MM-dd");
  }
  return String(value).trim();
}

/**
 * 소식(블로그) 목록.
 * 제목이 비어 있는 행은 무시하며 등록일 최신순으로 정렬한다.
 * 컬럼: A 번호 · B 제목 · C 블로그URL · D 등록일 (이미지는 사용하지 않음)
 */
function listPosts_() {
  const book = book_();
  const sheet = book.getSheetByName(POSTS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return { ok: true, items: [] };

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
  const items = rows
    .filter(function (row) {
      return String(row[1] || "").trim().length > 0;
    })
    .map(function (row) {
      return {
        id: String(row[0] || "").trim(),
        title: String(row[1] || "").trim(),
        link: String(row[2] || "").trim(),
        date: formatNoticeDate_(row[3]),
      };
    });

  items.sort(function (a, b) {
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });

  return { ok: true, items: items };
}

/** 전송받은 base64 파일들을 메일에 첨부할 수 있는 Blob으로 바꾼다. */
function toBlobs_(files) {
  const blobs = [];
  (files || []).forEach(function (f) {
    if (!f || !f.data) return;
    try {
      blobs.push(
        Utilities.newBlob(
          Utilities.base64Decode(f.data),
          f.type || "application/octet-stream",
          f.fileName,
        ),
      );
    } catch (err) {
      console.error("첨부 변환 실패(" + f.fileName + "): " + err);
    }
  });
  return blobs;
}

/**
 * 첨부파일을 드라이브에 보관한다. (DRIVE_FOLDER_ID 아래 접수번호 폴더)
 *
 * 드라이브 권한이 없으면 저장을 건너뛰고 빈 배열을 돌려준다.
 * 이 경우에도 접수는 정상 처리되고 파일은 담당자 메일에 첨부되므로 업무엔 지장이 없다.
 * 나중에 드라이브 권한을 승인하면 코드 수정 없이 자동으로 저장이 시작된다.
 */
function saveToDrive_(refNo, blobs) {
  if (!blobs.length) return [];

  try {
    const root = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const folder = root.createFolder(refNo);

    return blobs.map(function (blob) {
      const created = folder.createFile(blob);
      return { name: blob.getName(), url: created.getUrl() };
    });
  } catch (err) {
    console.error("드라이브 저장 건너뜀(권한 미승인 등): " + err);
    return [];
  }
}

/** 저장된 파일들을 "이름 링크" 여러 줄로 만든다. */
function linkList_(saved) {
  return saved
    .map(function (f) {
      return f.name + " " + f.url;
    })
    .join("\n");
}

/** 시트 탭 이름으로 쓸 수 없는 문자를 정리한다. */
function sheetNameFor_(label) {
  return String(label).replace(/[\[\]\*\/\\\?:]/g, " ").trim().slice(0, 90) || "미분류";
}

/**
 * 시트에 한 줄 추가한다.
 *
 * - 시트가 없으면 만든다.
 * - row에 있는데 헤더에 없는 키는 헤더 끝에 새 컬럼으로 덧붙인다.
 * - hiddenColumns 에 있는 컬럼은 화면에서 숨긴다. (RAW_JSON 처럼 긴 값)
 */
function appendRow_(book, sheetName, row, hiddenColumns) {
  let sheet = book.getSheetByName(sheetName);
  if (!sheet) sheet = book.insertSheet(sheetName);

  const keys = Object.keys(row);
  let header = [];

  if (sheet.getLastRow() === 0) {
    header = keys;
    sheet.getRange(1, 1, 1, header.length).setValues([header]);
    sheet.getRange(1, 1, 1, header.length).setFontWeight("bold").setBackground("#f1f3f4");
    sheet.setFrozenRows(1);
  } else {
    header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // 새로 생긴 문항은 헤더 끝에 추가한다. (기존 컬럼 순서는 건드리지 않음)
    const added = keys.filter(function (k) {
      return header.indexOf(k) === -1;
    });
    if (added.length) {
      sheet.getRange(1, header.length + 1, 1, added.length).setValues([added]);
      sheet
        .getRange(1, header.length + 1, 1, added.length)
        .setFontWeight("bold")
        .setBackground("#f1f3f4");
      header = header.concat(added);
    }
  }

  const values = header.map(function (name) {
    const v = row[name];
    return v === undefined || v === null ? "" : v;
  });
  sheet.appendRow(values);

  // 긴 컬럼은 숨겨서 시트를 읽기 좋게 유지한다.
  (hiddenColumns || []).forEach(function (name) {
    const idx = header.indexOf(name);
    if (idx >= 0) sheet.hideColumns(idx + 1);
  });
}

/**
 * 접수번호 발급: BH-YYYYMMDD-NNNN
 * "전체" 탭의 당일 접수 건수를 세어 순번을 매긴다.
 */
function nextRefNo_(book) {
  const today = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyyMMdd");
  const prefix = "BH-" + today + "-";

  const sheet = book.getSheetByName(ALL_SHEET);
  let count = 0;

  if (sheet && sheet.getLastRow() > 1) {
    const refs = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    for (let i = 0; i < refs.length; i++) {
      if (String(refs[i][0]).indexOf(prefix) === 0) count++;
    }
  }

  return prefix + Utilities.formatString("%04d", count + 1);
}

/** 내부 담당자 알림. 첨부파일이 있으면 메일에도 함께 붙인다. */
function notifyStaff_(refNo, common, detail, sheetUrl, blobs) {
  const lines = [];
  Object.keys(detail).forEach(function (key) {
    if (detail[key]) lines.push(key + ": " + detail[key]);
  });

  const options = {
    to: NOTIFY_TO,
    subject:
      "[견적문의] " + refNo + " · " + (common["업체·기관명"] || "") + " · " + (common["구분"] || ""),
    body:
      "새 견적 문의가 접수되었습니다.\n\n" +
      "구분: " + (common["구분"] || "") + "\n" +
      "업체·기관명: " + (common["업체·기관명"] || "") + "\n" +
      "담당자: " + (common["담당자명"] || "") + "\n" +
      "이메일: " + (common["이메일"] || "") + "\n" +
      "휴대폰: " + (common["휴대폰"] || "") + "\n" +
      "유입경로: " + (common["유입경로"] || "") + "\n\n" +
      "── 상세 ──\n" +
      lines.join("\n") +
      "\n\n시트에서 확인: " + sheetUrl,
  };

  // 메일 첨부는 총 25MB까지만 가능하므로 20MB 선에서 끊는다.
  if (blobs && blobs.length) {
    let total = 0;
    const picked = [];
    blobs.forEach(function (blob) {
      const size = blob.getBytes().length;
      if (total + size <= 20 * 1024 * 1024) {
        picked.push(blob);
        total += size;
      }
    });
    if (picked.length) options.attachments = picked;
  }

  MailApp.sendEmail(options);
}

/** 고객 접수 확인 메일 */
function confirmToCustomer_(refNo, common, raw) {
  const estimate = raw.estimate || {};
  let body =
    (common["담당자명"] || "") + "님, 안녕하세요.\n" +
    "비하이브코퍼레이션입니다.\n\n" +
    "보내주신 견적 문의가 정상적으로 접수되었습니다.\n\n" +
    "접수번호: " + refNo + "\n" +
    "문의 유형: " + (common["구분"] || "") + "\n\n";

  // 자동 산출이 가능한 건은 예상 금액을 함께 안내한다.
  if (estimate.auto && estimate.lines && estimate.lines.length) {
    body += "── 예상 견적 ──\n";
    estimate.lines.forEach(function (line) {
      body += "· " + line.label + ": " + Number(line.amount).toLocaleString("ko-KR") + "원\n";
    });
    body += "\n공급가액: " + Number(estimate.subtotal).toLocaleString("ko-KR") + "원\n";
    body += "부가세: " + Number(estimate.vat).toLocaleString("ko-KR") + "원\n";
    body += "합계: " + Number(estimate.total).toLocaleString("ko-KR") + "원\n\n";
  }

  body +=
    (estimate.note || "담당자가 확인 후 연락드리겠습니다.") + "\n\n" +
    "───────────────\n" +
    "주식회사 비하이브코퍼레이션\n" +
    "서울시 영등포구 국제금융로2길 17, 629호 (07327)\n" +
    "TEL. 010-6854-2019\n" +
    "E-mail. service@beehivecorp.co.kr\n";

  MailApp.sendEmail({
    to: common["이메일"],
    subject: "[비하이브코퍼레이션] 견적 문의가 접수되었습니다 (" + refNo + ")",
    body: body,
    name: SENDER_NAME,
    replyTo: NOTIFY_TO,
  });
}
