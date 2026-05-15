export const categories = [
  {
    name: "Пиццы",
  },
  {
    name: "Завтрак",
  },
  {
    name: "Закуски",
  },
  {
    name: "Коктейли",
  },
  {
    name: "Напитки",
  },
];
export const ingredients = [
  {
    name: "Сырный бортик",
    price: 205,
    imageUrl: "/ingredients/1.png",
  },
  {
    name: "Пряная говядина",
    price: 119,
    imageUrl: "/ingredients/2.png",
  },
  {
    name: "Моцарелла",
    price: 105,
    imageUrl: "/ingredients/3.png",
  },
  {
    name: "Сыры чеддер и пармезан",
    price: 79,
    imageUrl: "/ingredients/4.png",
  },
  {
    name: "Сыр блю чиз",
    price: 149,
    imageUrl: "/ingredients/5.png",
  },
  {
    name: "Острый перец халапеньо",
    price: 59,
    imageUrl: "/ingredients/6.png",
  },
  {
    name: "Нежный цыпленок",
    price: 79,
    imageUrl: "/ingredients/7.png",
  },
  {
    name: "Шампиньоны",
    price: 59,
    imageUrl: "/ingredients/8.png",
  },
  {
    name: "Бекон",
    price: 79,
    imageUrl: "/ingredients/9.png",
  },
  {
    name: "Ветчина",
    price: 79,
    imageUrl: "/ingredients/10.png",
  },
  {
    name: "Пикантная пеперонни",
    price: 79,
    imageUrl: "/ingredients/11.png",
  },
].map((obj, index) => ({ id: index + 1, ...obj }));

export const products = [
  {
    name: "Омлет с ветчиной и грибами",
    imageUrl: "/products/1.avif",
    categoryId: 2,
  },
  {
    name: "Омлет с пепперони",
    imageUrl: "/products/2.avif",
    categoryId: 2,
  },
  {
    name: "Кофе Латте",
    imageUrl: "/products/3.avif",
    categoryId: 2,
  },
  {
    name: "Дэнвич ветчина и сыр",
    imageUrl: "/products/4.avif",
    categoryId: 3,
  },
  {
    name: "Куриные наггетсы",
    imageUrl: "/products/5.avif",
    categoryId: 3,
  },
  {
    name: "Картофель из печи с соусом 🌱",
    imageUrl: "/products/6.avif",
    categoryId: 3,
  },
  {
    name: "Додстер",
    imageUrl: "/products/7.avif",
    categoryId: 3,
  },
  {
    name: "Острый Додстер 🌶️🌶️",
    imageUrl: "/products/8.avif",
    categoryId: 3,
  },
  {
    name: "Молочный коктейль Фисташка",
    imageUrl: "/products/9.avif",
    categoryId: 4,
  },
  {
    name: "Молочный коктейль Соленая карамель",
    imageUrl: "/products/10.avif",
    categoryId: 4,
  },
  {
    name: "Молочный коктейль с печеньем Орео",
    imageUrl: "/products/11.avif",
    categoryId: 4,
  },
  {
    name: "Классический молочный коктейль 👶",
    imageUrl: "/products/12.avif",
    categoryId: 4,
  },
  {
    name: "Ирландский Капучино",
    imageUrl: "/products/13.avif",
    categoryId: 5,
  },
  {
    name: "Кофе Карамельный капучино",
    imageUrl: "/products/14.avif",
    categoryId: 5,
  },
  {
    name: "Кофе Кокосовый латте",
    imageUrl: "/products/15.avif",
    categoryId: 5,
  },
  {
    name: "Кофе Американо",
    imageUrl: "/products/16.avif",
    categoryId: 5,
  },
  {
    name: "Кофе Латте",
    imageUrl: "/products/17.avif",
    categoryId: 5,
  },
];
