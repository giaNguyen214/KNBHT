const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "public/assets/keyframes/keyframes_output");

const itemData = fs
  .readdirSync(folderPath)
  .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
  .map((file) => ({
    img: `/assets/keyframes/keyframes_output/${file}`, // 👈 path chính xác
    title: path.parse(file).name,
  }));

fs.writeFileSync("src/itemData.json", JSON.stringify(itemData, null, 2));

console.log("✅ Đã tạo itemData.json với", itemData.length, "ảnh");
