function ambilId(inputString) {
  // Ekspresi reguler untuk menangkap ID channel YouTube
  const youtubeRegex = /https:\/\/www\.youtube\.com\/channel\/([a-zA-Z0-9_-]+)/;

  // Mencocokkan string dengan ekspresi reguler
  const match = inputString.match(youtubeRegex);

  // Mengambil bagian ID channel
  if (match && match[1]) {
    return match[1];
  } else {
    return null; // Mengembalikan null jika ID channel tidak ditemukan
  }
}

module.exports = {
  ambilId,
};
