function generateCarCard(car) {
  const template = document.querySelector("#car-card").innerHTML;
  const carDetails = {
    title: `${car.brand} ${car.model} ${car.year}`,
    details_id: car.details_id,
    image: car.image,
    price: car.price,
  };
  return template.replace(/\${(.*?)}/g, (x, g) => carDetails[g]);
}

export function appendCars(cars) {
  document.getElementById("first-load").innerHTML = "";
  if (!cars) {
    return;
  }
  const cardHTML = cars.map((c) => generateCarCard(c)).join("");
  document.querySelector(".mdl-grid").insertAdjacentHTML("beforeend", cardHTML);
}
