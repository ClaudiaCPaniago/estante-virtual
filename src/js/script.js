document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.querySelector("button");
  const searchInput = document.querySelector("input");
  const resultadosContainer = document.getElementById("resultados");

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
        .then((response) => response.json())
        .then((data) => {
          const resultados = data.items || [];
          resultadosContainer.innerHTML = resultados.length
            ? resultados
                .map((item) => {
                  const volumeInfo = item.volumeInfo;
                  const imageLink = volumeInfo.imageLinks
                    ? volumeInfo.imageLinks.thumbnail
                    : "https://via.placeholder.com/128x200.png?text=No+Cover";
                  const rating = volumeInfo.averageRating || "N/A";
                  return `
                    <div class="item-resultado">
                      <img src="${imageLink}" alt="${
                    volumeInfo.title
                  }" class="capa-livro">
                      <div class="info-container">
                        <h2>${volumeInfo.title}</h2>
                        <p class="descricao-meta autor">${
                          volumeInfo.authors
                            ? volumeInfo.authors.join(", ")
                            : "Autor desconhecido"
                        }</p>
                        <p class="descricao-meta descricao">${
                          volumeInfo.description || "Sem descrição"
                        }</p>
                        <p class="descricao-meta classificacao">Classificação: ${rating} ${renderStars(
                    rating
                  )}</p>
                        <a href="${
                          volumeInfo.infoLink
                        }" target="_blank">Saiba mais</a>
                      </div>
                    </div>
                  `;
                })
                .join("")
            : "<p>Nenhum resultado encontrado.</p>";
        })
        .catch((error) => {
          resultadosContainer.innerHTML = "<p>Erro ao buscar resultados.</p>";
          console.error("Erro:", error);
        });
    }
  });

  function renderStars(rating) {
    const numStars = Math.round(rating);
    let stars = "";
    for (let i = 0; i < 5; i++) {
      stars +=
        i < numStars
          ? '<span class="star filled" style="color: gold;">★</span>'
          : '<span class="star">☆</span>';
    }
    return stars;
  }
});
