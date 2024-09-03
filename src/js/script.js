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
                  const rating = volumeInfo.averageRating || "N/A"; // Obtém a classificação média ou 'N/A' se não estiver disponível
                  return `
                              <div class="item-resultado">
                                  <img src="${imageLink}" alt="${
                    volumeInfo.title
                  }" class="capa-livro">
                                  <h2>${volumeInfo.title}</h2>
                                  <p class="descricao-meta">${
                                    volumeInfo.authors
                                      ? volumeInfo.authors.join(", ")
                                      : "Autor desconhecido"
                                  }</p>
                                  <p class="descricao-meta">${
                                    volumeInfo.description || "Sem descrição"
                                  }</p>
                                  <p class="descricao-meta">Classificação: ${rating} ${renderStars(
                    rating
                  )}</p>
                                  <a href="${
                                    volumeInfo.infoLink
                                  }" target="_blank">Saiba mais</a>
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
    const numStars = Math.round(rating); // Arredonda a classificação para o número inteiro mais próximo
    let stars = "";
    for (let i = 0; i < 5; i++) {
      stars +=
        i < numStars
          ? '<span class="star filled">★</span>'
          : '<span class="star">☆</span>';
    }
    return stars;
  }
});
