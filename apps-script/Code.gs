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
const SHEET_ID = "1TevGPb4W2UBF19FJL5StSA_4JNi_MasBTzD-hoOSZ-A";

/** 접수 알림을 받을 내부 담당자 주소. 쉼표로 여러 명 지정 가능. */
const NOTIFY_TO = "info@beehivecorp.co.kr";
/** 고객에게 보내는 메일의 발신자 표시 이름 */
const SENDER_NAME = "비하이브코퍼레이션";
/** 모든 문의가 모이는 탭 이름 */
const ALL_SHEET = "전체";
/** 첨부파일이 저장될 구글 드라이브 폴더 이름 (없으면 자동 생성) */
const DRIVE_FOLDER = "비하이브 견적문의 첨부파일";
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

    // 첨부파일을 드라이브에 저장하고, 시트에는 파일명 대신 링크를 남긴다.
    const saved = saveFiles_(refNo, payload.files);
    if (saved.length) {
      common["첨부파일"] = linkList_(saved);

      // 상세 탭의 "<문항> — 첨부" 컬럼에는 파일명이 들어 있다.
      // 그 파일명에 해당하는 링크로 바꿔준다.
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
      notifyStaff_(refNo, common, detail, book.getUrl(), saved);
      confirmToCustomer_(refNo, common, payload.raw || {});
    } catch (mailError) {
      console.error("메일 발송 실패: " + mailError);
    }

    return json_({ ok: true, refNo: refNo });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: "접수 처리 중 오류가 발생했습니다." });
  } finally {
    lock.releaseLock();
  }
}

/** 브라우저에서 주소를 열었을 때 동작 확인용 */
function doGet() {
  return json_({ ok: true, service: "beehive-quote-intake" });
}

function json_(object) {
  return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/**
 * 첨부파일을 드라이브에 저장한다.
 *
 * DRIVE_FOLDER 아래에 접수번호로 하위 폴더를 만들어 넣습니다.
 * 반환값에는 시트에 남길 링크와, 메일에 첨부할 Blob이 함께 담깁니다.
 */
function saveFiles_(refNo, files) {
  if (!files || !files.length) return [];

  const parents = DriveApp.getFoldersByName(DRIVE_FOLDER);
  const root = parents.hasNext() ? parents.next() : DriveApp.createFolder(DRIVE_FOLDER);
  const folder = root.createFolder(refNo);

  const saved = [];
  files.forEach(function (f) {
    if (!f || !f.data) return;
    try {
      const blob = Utilities.newBlob(
        Utilities.base64Decode(f.data),
        f.type || "application/octet-stream",
        f.fileName,
      );
      const created = folder.createFile(blob);
      saved.push({
        name: f.fileName,
        url: created.getUrl(),
        questionId: f.questionId || "",
        blob: blob,
      });
    } catch (err) {
      // 파일 하나가 실패해도 접수 자체는 계속 진행한다.
      console.error("첨부 저장 실패(" + f.fileName + "): " + err);
    }
  });

  return saved;
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
function notifyStaff_(refNo, common, detail, sheetUrl, saved) {
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

  // 메일 첨부는 총 25MB까지만 가능하므로, 넘으면 드라이브 링크로만 안내한다.
  if (saved && saved.length) {
    let total = 0;
    const blobs = [];
    saved.forEach(function (f) {
      const size = f.blob.getBytes().length;
      if (total + size <= 20 * 1024 * 1024) {
        blobs.push(f.blob);
        total += size;
      }
    });
    if (blobs.length) options.attachments = blobs;
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
    "E-mail. info@beehivecorp.co.kr\n";

  MailApp.sendEmail({
    to: common["이메일"],
    subject: "[비하이브코퍼레이션] 견적 문의가 접수되었습니다 (" + refNo + ")",
    body: body,
    name: SENDER_NAME,
    replyTo: NOTIFY_TO,
  });
}
