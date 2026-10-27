// MEB COP31 OGM Reel'leri onay sayfası — yanıt kaydı (Google Apps Script web uygulaması).
// Kurulum: script.google.com → Yeni proje → bu kodu yapıştır → Dağıt → Yeni dağıtım → Web uygulaması
//   Yürüten: Ben · Erişim: Herkes → Dağıt → Web uygulaması URL'sini index.html içindeki ONAY_SCRIPT_URL'ye yaz.
// İlk çalıştırmada Drive'ında "OGM Reel Onay Yanıtları" adlı e-tablo oluşur; her kayıt bir satır.
const TABLO_ADI = 'OGM Reel Onay Yanıtları';
function tablo() {
  const p = PropertiesService.getScriptProperties();
  let id = p.getProperty('tabloId');
  let ss = id ? SpreadsheetApp.openById(id) : null;
  if (!ss) { ss = SpreadsheetApp.create(TABLO_ADI); p.setProperty('tabloId', ss.getId()); ss.getActiveSheet().appendRow(['zaman', 'no', 'ad', 'karar', 'not']); }
  return ss.getActiveSheet();
}
function doPost(e) {
  const veri = JSON.parse(e.postData.contents);
  const s = tablo();
  const zaman = new Date().toISOString();
  (veri.kayitlar || []).forEach(k => s.appendRow([zaman, String(k.no), String(k.ad || '').slice(0, 80), String(k.karar || ''), String(k.not || '').slice(0, 2000)]));
  return ContentService.createTextOutput(JSON.stringify({tamam: true})).setMimeType(ContentService.MimeType.JSON);
}
function doGet() {
  const s = tablo();
  const v = s.getDataRange().getValues().slice(1);
  const satirlar = v.map(r => ({zaman: r[0] instanceof Date ? r[0].toISOString() : String(r[0]), no: String(r[1]), ad: String(r[2]), karar: String(r[3]), not: String(r[4])}));
  return ContentService.createTextOutput(JSON.stringify({satirlar})).setMimeType(ContentService.MimeType.JSON);
}
