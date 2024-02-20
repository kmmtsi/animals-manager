// 現在時刻のタイムスタンプを取得
export const getTimeStamp = () => new Date().toISOString();

// Dateオブジェクトに変換
const getDateObj = (timestamp: string) => new Date(timestamp);

// timestamp -> サイト表示用データ
export const getLocalDateString = (timestamp: string) => {
  const dateObj = getDateObj(timestamp);
  return dateObj.toLocaleDateString();
};

// 日付の処理
// https://qiita.com/__knm__/items/3c7466a19abdf5192d11
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
// https://developer.mozilla.org/ja/docs/Web/HTML/Element/time
