

const SHEET_NAME = "Produtos";
const R2_ACCOUNT_ID = "SEU_CLOUDFLARE_ACCOUNT_ID"; 
const R2_BUCKET_NAME = "cardapio-digital";
const R2_API_TOKEN = "SEU_API_TOKEN";
const R2_PUBLIC_BASE_URL = "https://pub-67111bf9eee943e3aeaf4b493b4dd034.r2.dev/";

function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return responseJSON({ ok: true, data: [] });
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const products = rows.map((row, index) => {
      let obj = {};
      headers.forEach((header, colIdx) => {
        let key = header.toString().trim().toLowerCase();
        if (key === 'preço' || key === 'preco' || key === 'preco_brl') key = 'preco';
        if (key === 'imagem' || key === 'img_1' || key === 'img_url') key = 'img_url';
        obj[key] = row[colIdx];
      });
      if (!obj.id) obj.id = String(index + 1);
      return obj;
    });

    return responseJSON({ ok: true, data: products });
  } catch (err) {
    return responseJSON({ ok: false, error: err.toString() });
  }
}

function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;

    // SALVAR DADOS DE PRODUTOS
    if (action === 'save') {
      const products = contents.data || [];
      const sheet = getOrCreateSheet();
      
      sheet.clearContents();
      const headers = ['id', 'nome', 'categoria', 'descricao', 'preco', 'badge', 'img_url', 'status'];
      sheet.appendRow(headers);
      
      products.forEach(p => {
        sheet.appendRow([
          p.id || '',
          p.nome || '',
          p.categoria || '',
          p.descricao || '',
          p.preco || p.preco_grande || 0,
          p.badge || '',
          p.img_url || '',
          p.status || 'ativo'
        ]);
      });

      return responseJSON({ ok: true, saved: products.length, message: 'Sincronizado com sucesso!' });
    }

    // UPLOAD PARA CLOUDFLARE R2 COM ORGANIZAÇÃO POR SUBPASTAS DE CLIENTES
    if (action === 'uploadR2') {
      const base64Data = contents.base64.split(',')[1] || contents.base64;
      const folderPrefix = contents.folder ? (contents.folder.replace(/[^a-z0-9_-]/gi, '') + '/') : 'pizzariatododia/';
      const fileName = folderPrefix + (contents.fileName || ('upload_' + Date.now() + '.png'));
      const mimeType = contents.mimeType || 'image/png';

      if (R2_ACCOUNT_ID && R2_ACCOUNT_ID !== "SEU_CLOUDFLARE_ACCOUNT_ID") {
        const url = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${encodeURIComponent(fileName)}`;
        const bytes = Utilities.base64Decode(base64Data);
        
        const options = {
          method: 'put',
          headers: {
            'Authorization': 'Bearer ' + R2_API_TOKEN,
            'Content-Type': mimeType
          },
          payload: bytes,
          muteHttpExceptions: true
        };

        const res = UrlFetchApp.fetch(url, options);
        if (res.getResponseCode() >= 200 && res.getResponseCode() < 300) {
          const publicUrl = R2_PUBLIC_BASE_URL + encodeURI(fileName);
          return responseJSON({ ok: true, url: publicUrl, fileName: fileName });
        }
      }

      // Fallback Drive se R2 nao estiver ativo no Apps Script
      const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, contents.fileName || 'upload.png');
      const file = DriveApp.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      const driveUrl = "https://lh3.googleusercontent.com/d/" + file.getId();

      return responseJSON({ ok: true, url: driveUrl, fileName: fileName });
    }

    return responseJSON({ ok: false, error: 'Ação inválida' });
  } catch (err) {
    return responseJSON({ ok: false, error: err.toString() });
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['id', 'nome', 'categoria', 'descricao', 'preco', 'badge', 'img_url', 'status']);
  }
  return sheet;
}

function responseJSON(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
