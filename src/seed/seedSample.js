const { prisma } = require("../config/connectSql");

const samples = [
  {
    id : 1,
    typ01 : [1,2,4],
    typ02 : [1, 8],
    typ03 : [1, 9],
    img: "blue_cv.png",
    name: "CV Hiện Đại Xanh",
    descript:
      "Mẫu CV hiện đại với thiết kế sạch sẽ, phù hợp cho các vị trí công nghệ và kinh doanh.",
  },
  { 
    id : 2,
    typ01 : [2],
    typ02 : [2, 4, 7, 8],
    typ03 : [6, 9],
    img: "classic_cv.png",
    name: "CV Cổ Điển",
    descript:
      "Thiết kế truyền thống, chuyên nghiệp, phù hợp cho các ngành tài chính và luật.",
  },
  { 
    id : 3,
    typ01 : [3],
    typ02 : [1, 3, 8],
    typ03 : [1, 3, 4, 5, 7, 8],
    img: "light_cv.png",
    name: "CV Sáng Tạo",
    descript:
      "Mẫu CV đầy màu sắc và sáng tạo, lý tưởng cho designer và nghệ sĩ.",
  },
  { 
    id : 4,
    typ01 : [1, 4],
    typ02 : [1, 4, 5, 7, 8],
    typ03 : [9],
    img: "simple_cv.png",
    name: "CV Tối Giản",
    descript:
      "Thiết kế đơn giản, tập trung vào nội dung, phù hợp mọi ngành nghề.",
  },
  { 
    id : 5,
    typ01 : [4],
    typ02 : [1, 4, 5, 7, 8],
    typ03 : [2, 9],
    img: "business_cv.png",
    name: "CV Doanh Nghiệp",
    descript:
      "Mẫu CV chuyên nghiệp với tone màu xanh lá, phù hợp cho quản lý.",
  },
  { 
    id : 6,
    typ01 : [2],
    typ02 : [1, 4, 5, 6, 7, 9, 10],
    typ03 : [1, 6, 9],
    img: "dark_cv.png",
    name: "CV Công Nghệ",
    descript:
      "Thiết kế hiện đại với theme tối, hoàn hảo cho lập trình viên.",
  },
  { 
    id : 7,
    typ01 : [3, 4],
    typ02 : [7, 8],
    typ03 : [10],
    img: "polite_cv.png",
    name: "CV Thanh Lịch",
    descript:
      "Mẫu CV sang trọng với màu tím, phù hợp cho các vị trí cao cấp.",
  },
  { 
    id : 8,
    typ01 : [1],
    typ02 : [1, 3, 5, 7, 8, 10],
    typ03 : [1, 9],
    img: "medic_cv.png",
    name: "CV Y Tế",
    descript:
      "Thiết kế chuyên nghiệp cho ngành y tế với tone màu trắng sạch.",
  },
];

async function main() {
  await prisma.postSample.deleteMany();

  await prisma.postSample.createMany({
    data: samples.map((item, index) => ({
      id : item.id,
      img: item.img,
      name: item.name,
      descript: item.descript,
      typ01: item.typ01,   
      typ02: item.typ02, 
      typ03: item.typ03, 
    })),
  });

  console.log("✅ Seed dữ liệu PostSample thành công!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });