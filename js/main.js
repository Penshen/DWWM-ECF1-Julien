document.addEventListener("DOMContentLoaded", () => {
  // Vérifier si nous sommes sur la page tickets.html
  const isTicketsPage = window.location.pathname.includes("tickets.html");

  // Si ce n'est pas la page tickets.html, on arrête l'exécution
  if (!isTicketsPage) return;

  const searchInput = document.getElementById("search-input");
  const hideButton = document.getElementById("hide-sold-out");
  const sortPriceButton = document.getElementById("sort-price");
  const resetButton = document.getElementById("reset-filters");
  const cardsContainer = document.querySelector(".cards-container");
  let hidingSoldOut = false;
  let currentPriceSort = "asc";

  // Fonction pour appliquer l'alternance des styles
  function updateCardStyles() {
    const visibleCards = Array.from(
      document.querySelectorAll(".card, .card-reverse")
    );

    visibleCards.forEach((card, index) => {
      // Réinitialiser les classes
      card.classList.remove("card", "card-reverse");
      // Ajouter la classe appropriée selon la position
      card.classList.add(index % 2 === 1 ? "card-reverse" : "card");
    });
  }

  // Fonction pour trier les cartes par prix
  function sortCardsByPrice(direction) {
    const cards = Array.from(cardsContainer.children);

    cards.sort((a, b) => {
      const priceA = parseFloat(a.artistData.price);
      const priceB = parseFloat(b.artistData.price);
      return direction === "asc" ? priceA - priceB : priceB - priceA;
    });

    cardsContainer.innerHTML = "";
    cards.forEach((card) => cardsContainer.appendChild(card));
    updateCardStyles();
  }

  // Fonction pour mettre à jour le contenu des boutons en tenant compte du mode mobile
  function updateButtonContent(button, icon, text) {
    const isMobile = window.innerWidth <= 768;
    button.innerHTML = `
      <span class="filter-icon">${icon}</span>
      ${!isMobile ? `<span class="button-text">${text}</span>` : ""}
    `;
  }

  // Gestionnaire pour le bouton de tri par prix
  if (sortPriceButton) {
    sortPriceButton.addEventListener("click", () => {
      currentPriceSort = currentPriceSort === "asc" ? "desc" : "asc";
      sortPriceButton.setAttribute("data-sort", currentPriceSort);
      updateButtonContent(
        sortPriceButton,
        "💰",
        `Prix: ${currentPriceSort === "asc" ? "Croissant" : "Décroissant"}`
      );
      sortCardsByPrice(currentPriceSort);
    });
  }

  // Fonction pour filtrer les cartes
  function filterCards() {
    const searchTerm = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".card, .card-reverse");

    cards.forEach((card) => {
      const artistData = card.artistData; // On stocke les données dans la carte
      const artistName = card
        .querySelector(".band-name")
        .textContent.toLowerCase();
      const description = card
        .querySelector(".description")
        .textContent.toLowerCase();

      const matchesSearch =
        artistName.includes(searchTerm) || description.includes(searchTerm);
      const isSoldOut = artistData.ticketsSold >= 1000;

      // Affiche la carte si elle correspond aux critères de recherche et de filtrage
      if (matchesSearch && !(hidingSoldOut && isSoldOut)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });

    // Mettre à jour les styles après le filtrage
    updateCardStyles();
  }

  // Gestionnaire d'événements pour la recherche
  if (searchInput) {
    searchInput.addEventListener("input", filterCards);
  }

  // Gestionnaire d'événements pour le bouton de filtrage
  if (hideButton) {
    updateButtonContent(hideButton, "🎫", "Masquer les SOLD OUT");

    hideButton.addEventListener("click", () => {
      hidingSoldOut = !hidingSoldOut;
      hideButton.classList.toggle("active");
      updateButtonContent(
        hideButton,
        "🎫",
        hidingSoldOut ? "Afficher tous les événements" : "Masquer les SOLD OUT"
      );
      filterCards();
    });
  }

  // Fonction de réinitialisation mise à jour
  function resetFilters() {
    searchInput.value = "";
    hidingSoldOut = false;
    hideButton.classList.remove("active");
    updateButtonContent(hideButton, "🎫", "Masquer les SOLD OUT");

    currentPriceSort = "asc";
    sortPriceButton.setAttribute("data-sort", "asc");
    updateButtonContent(sortPriceButton, "💰", "Prix: Croissant");

    fetch("data/festival.json")
      .then((response) => response.json())
      .then((data) => {
        cardsContainer.innerHTML = "";

        const sortedArtists = data.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA - dateB;
        });

        sortedArtists.forEach((artistData, index) => {
          const card = createArtistCard(artistData, index);
          cardsContainer.appendChild(card);
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la réinitialisation:", error);
        cardsContainer.innerHTML = `<p style="color: white;">Erreur lors du chargement des données: ${error.message}</p>`;
      });
  }

  // Gestionnaire pour le bouton reset
  if (resetButton) {
    updateButtonContent(resetButton, "🔄", "Réinitialiser");
  }

  // Ajouter un écouteur pour le redimensionnement de la fenêtre
  window.addEventListener("resize", () => {
    updateButtonContent(
      hideButton,
      "🎫",
      hidingSoldOut ? "Afficher tous les événements" : "Masquer les SOLD OUT"
    );
    updateButtonContent(
      sortPriceButton,
      "💰",
      `Prix: ${currentPriceSort === "asc" ? "Croissant" : "Décroissant"}`
    );
    updateButtonContent(resetButton, "🔄", "Réinitialiser");
  });

  // Modification de la fonction createArtistCard pour stocker les données
  function createArtistCard(artistData, index) {
    const card = document.createElement("div");
    card.className = index % 2 === 1 ? "card-reverse" : "card";
    card.artistData = artistData;

    // Image section
    const cardImage = document.createElement("div");
    cardImage.className = "card-image";
    const img = document.createElement("img");
    const imageName = artistData.artist
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[']/g, "")
      .replace(/\s+/g, "-");

    img.src = `img/${imageName}.jpg`;
    img.alt = `Artiste : ${artistData.artist}`;
    cardImage.appendChild(img);

    // Content section
    const cardContent = document.createElement("div");
    cardContent.className = "card-content";

    const bandName = document.createElement("h2");
    bandName.className = "band-name";
    bandName.textContent = artistData.artist.toUpperCase();

    const description = document.createElement("p");
    description.className = "description";
    description.textContent = artistData.description;

    // Progress bar
    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-container";

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";

    const percentage = (artistData.ticketsSold / 1000) * 100;
    progressBar.style.width = `${percentage}%`;

    const ticketsText = document.createElement("span");
    ticketsText.className = "tickets-text";
    const remainingTickets = 1000 - artistData.ticketsSold;
    ticketsText.textContent =
      remainingTickets > 0
        ? `${remainingTickets} places restantes`
        : "SOLD OUT";

    const isSoldOut = artistData.ticketsSold > 999;
    progressContainer.setAttribute("data-sold-out", isSoldOut);
    progressContainer.title = `${artistData.ticketsSold}/1000 tickets vendus`;

    progressContainer.appendChild(progressBar);
    progressContainer.appendChild(ticketsText);

    // Reservation section
    const reservation = document.createElement("div");
    reservation.className = "reservation";

    const reserveButton = document.createElement("button");
    reserveButton.className = "reserve-button";
    reserveButton.textContent = "JE RÉSERVE MA PLACE !";

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = `${artistData.price} €`;

    reservation.appendChild(reserveButton);
    reservation.appendChild(price);

    // Assembler la carte
    cardContent.appendChild(bandName);
    cardContent.appendChild(description);
    cardContent.appendChild(progressContainer);
    cardContent.appendChild(reservation);

    card.appendChild(cardImage);
    card.appendChild(cardContent);

    // Ajouter les badges
    if (isSoldOut) {
      const soldOutBadge = document.createElement("div");
      soldOutBadge.className = "sold-out-badge";
      soldOutBadge.textContent = "SOLD OUT";
      card.appendChild(soldOutBadge);
    } else if (remainingTickets <= 10 && !isSoldOut) {
      const lastTicketsBadge = document.createElement("div");
      lastTicketsBadge.className = "last-tickets-badge";
      lastTicketsBadge.textContent = `DERNIÈRES PLACES ! (${remainingTickets})`;
      card.appendChild(lastTicketsBadge);
    }

    return card;
  }

  // Chargement initial des données
  fetch("data/festival.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors du chargement du fichier JSON");
      }
      return response.json();
    })
    .then((data) => {
      if (!cardsContainer) {
        throw new Error("Conteneur .cards-container non trouvé");
      }

      const sortedArtists = data.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA - dateB;
      });

      sortedArtists.forEach((artistData, index) => {
        const card = createArtistCard(artistData, index);
        cardsContainer.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Erreur:", error);
      if (cardsContainer) {
        cardsContainer.innerHTML = `<p style="color: white;">Erreur lors du chargement des données: ${error.message}</p>`;
      }
    });
});
