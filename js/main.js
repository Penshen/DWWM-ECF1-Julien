document.addEventListener("DOMContentLoaded", () => {
  // Fonction utilitaire pour formater les dates
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Vérifier d'abord quelle page nous sommes
  const isProgramPage = window.location.pathname.includes("program.html");
  const isInfoPage = window.location.pathname.includes("info.html");
  const isTicketsPage = window.location.pathname.includes("tickets.html");

  // Ajout du code pour le menu burger au début du fichier
  const menuToggle = document.querySelector(".burger-menu");
  const menuOverlay = document.querySelector(".menu-overlay");
  const closeMenu = document.querySelector(".close-menu");
  const body = document.body;

  if (menuToggle && menuOverlay && closeMenu) {
    // Function to toggle menu state
    const toggleMenu = (show) => {
      menuOverlay.classList.toggle("active", show);
      body.classList.toggle("menu-open", show);
    };

    // Open menu
    menuToggle.addEventListener("click", () => {
      toggleMenu(true);
    });

    // Close menu
    closeMenu.addEventListener("click", () => {
      toggleMenu(false);
    });

    // Close menu when clicking overlay (outside nav)
    menuOverlay.addEventListener("click", (e) => {
      if (e.target === menuOverlay) {
        toggleMenu(false);
      }
    });

    // Close menu when clicking links
    const mobileNavLinks = document.querySelectorAll(".mobile-nav a");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        toggleMenu(false);
      });
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuOverlay.classList.contains("active")) {
        toggleMenu(false);
      }
    });
  }

  // Gestion de la page programme
  if (isProgramPage) {
    const programDays = document.querySelector(".program-days");

    function createProgramCard(artistData) {
      const card = document.createElement("div");
      card.className = "program-card";

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

      const cardContent = document.createElement("div");
      cardContent.className = "card-content";

      const bandName = document.createElement("h2");
      bandName.className = "band-name";
      bandName.textContent = artistData.artist.toUpperCase();

      const dateTime = document.createElement("div");
      dateTime.className = "datetime-container";
      dateTime.innerHTML = `
        <p class="datetime">
          <span class="icon">⌚</span> ${artistData.time}
        </p>
      `;

      const descriptionContainer = document.createElement("div");
      descriptionContainer.className = "description-container";

      const description = document.createElement("p");
      description.className = "description";
      description.textContent = artistData.description;
      description.style.display = "none";

      const infoButton = document.createElement("button");
      infoButton.className = "button-info";
      infoButton.textContent = "?";
      infoButton.addEventListener("click", () => {
        description.style.display =
          description.style.display === "none" ? "block" : "none";
        infoButton.classList.toggle("active");
      });

      descriptionContainer.appendChild(description);
      descriptionContainer.appendChild(infoButton);

      cardContent.appendChild(bandName);
      cardContent.appendChild(dateTime);
      cardContent.appendChild(descriptionContainer);

      card.appendChild(cardImage);
      card.appendChild(cardContent);

      return card;
    }

    fetch("data/festival.json")
      .then((response) => response.json())
      .then((data) => {
        const artistsByDate = data.reduce((acc, artist) => {
          if (!acc[artist.date]) {
            acc[artist.date] = [];
          }
          acc[artist.date].push(artist);
          return acc;
        }, {});

        const sortedDates = Object.keys(artistsByDate).sort();

        sortedDates.forEach((date) => {
          const daySection = document.createElement("div");
          daySection.className = "program-day";

          const dayHeader = document.createElement("div");
          dayHeader.className = "day-header";
          dayHeader.innerHTML = `<h3>${formatDate(date)}</h3>`;

          const dayCards = document.createElement("div");
          dayCards.className = "day-cards";

          const sortedArtists = artistsByDate[date].sort((a, b) =>
            a.time.localeCompare(b.time)
          );

          sortedArtists.forEach((artist) => {
            const card = createProgramCard(artist);
            dayCards.appendChild(card);
          });

          daySection.appendChild(dayHeader);
          daySection.appendChild(dayCards);
          programDays.appendChild(daySection);
        });
      })
      .catch((error) => {
        console.error("Erreur:", error);
        programDays.innerHTML = `<p style="color: white;">Erreur lors du chargement des données: ${error.message}</p>`;
      });
    return; // Sortir de la fonction si c'est la page programme
  }

  // Gestion de la page info
  if (isInfoPage) {
    // Toggle functionality for info page
    const toggleButtons = document.querySelectorAll(".toggle-button");
    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const content = button.nextElementSibling;
        const icon = button.querySelector(".toggle-icon");

        // Toggle the active class on both button and content
        button.classList.toggle("active");
        content.classList.toggle("active");

        // Update the icon
        icon.textContent = button.classList.contains("active") ? "×" : "+";
      });
    });
    return;
  }

  // Gestion de la page tickets
  if (isTicketsPage) {
    const searchInput = document.getElementById("search-input");
    const hideButton = document.getElementById("hide-sold-out");
    const sortPriceButton = document.getElementById("sort-price");
    const resetButton = document.getElementById("reset-filters");
    const cardsContainer = document.querySelector(".cards-container");
    const dateFilter = document.getElementById("date-filter");
    const dateDropdown = document.getElementById("date-dropdown");
    let hidingSoldOut = false;
    let currentPriceSort = "asc";
    let selectedDate = "all";

    // Fonction pour créer les cartes
    function createTicketCard(artistData, isReverse = false) {
      const card = document.createElement("div");
      card.className = isReverse ? "card-reverse" : "card";
      card.artistData = artistData;

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

      const cardContent = document.createElement("div");
      cardContent.className = "card-content";

      const bandName = document.createElement("h2");
      bandName.className = "band-name";
      bandName.textContent = artistData.artist.toUpperCase();

      // Ajouter la date et l'heure
      const dateTimeContainer = document.createElement("div");
      dateTimeContainer.className = "datetime-container";

      const dateTime = document.createElement("p");
      dateTime.className = "datetime";

      // Formater la date
      const date = new Date(artistData.date);
      const formattedDate = date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      dateTime.innerHTML = `
        <span class="icon">📅</span> ${formattedDate}
        <span class="separator">•</span>
        <span class="icon">⌚</span> ${artistData.time}
      `;

      dateTimeContainer.appendChild(dateTime);

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

      // Calculer les tickets restants et le statut SOLD OUT
      const remainingTickets = 1000 - artistData.ticketsSold;
      const isSoldOut = remainingTickets < 5;

      const ticketsText = document.createElement("span");
      ticketsText.className = "tickets-text";
      ticketsText.textContent = isSoldOut
        ? "SOLD OUT"
        : `${remainingTickets} places restantes`;

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
      cardContent.appendChild(dateTimeContainer);
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
      } else if (remainingTickets <= 10) {
        const lastTicketsBadge = document.createElement("div");
        lastTicketsBadge.className = "last-tickets-badge";
        lastTicketsBadge.textContent = `DERNIÈRES PLACES ! (${remainingTickets})`;
        card.appendChild(lastTicketsBadge);
      }

      return card;
    }

    // Fonction pour créer les options de date
    function createDateOptions(data) {
      if (!dateDropdown) return;

      const uniqueDates = [
        ...new Set(data.map((artist) => artist.date)),
      ].sort();

      dateDropdown.innerHTML = `
        <h3 class="dropdown-title">Filtrer par date</h3>
        <div class="date-option ${selectedDate === "all" ? "selected" : ""}">
          <input type="radio" name="date-filter" id="date-all" value="all" ${
            selectedDate === "all" ? "checked" : ""
          } hidden>
          <span class="radio-custom"></span>
          <label for="date-all">Toutes les dates</label>
        </div>
        ${uniqueDates
          .map(
            (date) => `
            <div class="date-option ${selectedDate === date ? "selected" : ""}">
              <input type="radio" name="date-filter" id="date-${date}" value="${date}" ${
              selectedDate === date ? "checked" : ""
            } hidden>
              <span class="radio-custom"></span>
              <label for="date-${date}">${formatDate(date)}</label>
            </div>
          `
          )
          .join("")}
        <button class="apply-button">Appliquer</button>
      `;
    }

    // Charger les données et créer les cartes
    fetch("data/festival.json")
      .then((response) => response.json())
      .then((data) => {
        // Créer les cartes
        data.forEach((artist, index) => {
          const card = createTicketCard(artist, index % 2 !== 0); // Alterner entre normal et reverse
          cardsContainer.appendChild(card);
        });

        // Créer les options de date
        createDateOptions(data);

        // Gestionnaire pour le dropdown de dates
        if (dateFilter && dateDropdown) {
          dateFilter.addEventListener("click", (e) => {
            e.stopPropagation();
            dateDropdown.classList.toggle("active");
            dateFilter.classList.toggle("active");
          });

          // Gestionnaire pour les options
          dateDropdown.addEventListener("click", (e) => {
            const dateOption = e.target.closest(".date-option");
            if (dateOption) {
              const input = dateOption.querySelector('input[type="radio"]');
              if (input) {
                selectedDate = input.value;
                filterCards();
              }
            }
          });

          // Gestionnaire pour le bouton Appliquer
          const applyButton = dateDropdown.querySelector(".apply-button");
          if (applyButton) {
            applyButton.addEventListener("click", () => {
              dateDropdown.classList.remove("active");
              dateFilter.classList.remove("active");
            });
          }

          // Fermer le dropdown quand on clique en dehors
          document.addEventListener("click", (e) => {
            if (
              !dateFilter.contains(e.target) &&
              !dateDropdown.contains(e.target)
            ) {
              dateDropdown.classList.remove("active");
              dateFilter.classList.remove("active");
            }
          });
        }

        // Gestionnaire pour le bouton "Masquer les SOLD OUT"
        if (hideButton) {
          hideButton.addEventListener("click", () => {
            hidingSoldOut = !hidingSoldOut;
            hideButton.classList.toggle("active");
            filterCards();
          });
        }

        // Gestionnaire pour le bouton de tri par prix
        if (sortPriceButton) {
          sortPriceButton.addEventListener("click", () => {
            currentPriceSort = currentPriceSort === "asc" ? "desc" : "asc";
            sortPriceButton.innerHTML = `
              <span class="filter-icon">💰</span>
              <span class="button-text">Prix: ${
                currentPriceSort === "asc" ? "Croissant" : "Décroissant"
              }</span>
            `;
            sortPriceButton.classList.toggle("active");
            sortCards();
          });
        }

        // Gestionnaire pour le bouton Reset
        if (resetButton) {
          resetButton.addEventListener("click", () => {
            // Réinitialiser tous les filtres
            searchInput.value = "";
            hidingSoldOut = false;
            currentPriceSort = "asc";
            selectedDate = "all";

            // Réinitialiser les classes active
            hideButton.classList.remove("active");
            sortPriceButton.classList.remove("active");
            dateFilter.classList.remove("active");
            dateDropdown.classList.remove("active");

            // Réinitialiser le texte des boutons
            sortPriceButton.innerHTML = `
              <span class="filter-icon">💰</span>
              <span class="button-text">Prix: Croissant</span>
            `;
            dateFilter.innerHTML = `
              <span class="filter-icon">📅</span>
              <span class="button-text">Dates</span>
            `;

            // Réappliquer les filtres
            filterCards();
          });
        }

        // Fonction pour trier les cartes par prix
        function sortCards() {
          const cards = Array.from(
            cardsContainer.querySelectorAll(".card, .card-reverse")
          );
          cards.sort((a, b) => {
            const priceA = a.artistData.price;
            const priceB = b.artistData.price;
            return currentPriceSort === "asc"
              ? priceA - priceB
              : priceB - priceA;
          });

          // Réappliquer l'alternance des styles après le tri
          cards.forEach((card, index) => {
            card.className = index % 2 !== 0 ? "card-reverse" : "card";
            cardsContainer.appendChild(card);
          });
        }

        // Gestionnaire pour la barre de recherche
        if (searchInput) {
          searchInput.addEventListener("input", () => {
            filterCards();
          });
        }
      })
      .catch((error) => {
        console.error("Erreur:", error);
        cardsContainer.innerHTML = `<p style="color: white;">Erreur lors du chargement des données: ${error.message}</p>`;
      });

    // Ajouter cette fonction juste après la déclaration des variables
    function filterCards() {
      const cards = cardsContainer.querySelectorAll(".card, .card-reverse");
      const searchTerm = searchInput.value.toLowerCase();

      let visibleCards = 0;
      let visibleSoldOutCards = 0;

      cards.forEach((card) => {
        const artistData = card.artistData;
        let shouldShow = true;

        // Filtre de recherche
        if (searchTerm) {
          shouldShow = artistData.artist.toLowerCase().includes(searchTerm);
        }

        // Filtre des dates
        if (shouldShow && selectedDate !== "all") {
          shouldShow = artistData.date === selectedDate;
        }

        // Filtre SOLD OUT
        if (shouldShow && hidingSoldOut) {
          const remainingTickets = 1000 - artistData.ticketsSold;
          shouldShow = remainingTickets >= 5;
        }

        // Afficher ou cacher la carte
        card.style.display = shouldShow ? "" : "none";

        // Compter les cartes visibles
        if (shouldShow) {
          visibleCards++;
          if (card.querySelector(".sold-out-badge")) {
            visibleSoldOutCards++;
          }
        }
      });

      // Mettre à jour le texte du bouton de filtre
      if (dateFilter) {
        const selectedText =
          selectedDate === "all" ? "Dates" : formatDate(selectedDate);

        dateFilter.innerHTML = `
          <span class="filter-icon">📅</span>
          <span class="button-text">${selectedText}</span>
        `;
      }
    }
  }

  // Ajouter cette fonction dans votre fichier main.js
  function initializeEqualizerToggle() {
    const toggleButtons = document.querySelectorAll(".equalizer-toggle");

    toggleButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Trouver l'equalizer associé (le plus proche)
        const equalizer = this.closest("header").querySelector(".equalizer");

        // Toggle la classe paused sur le bouton
        this.classList.toggle("paused");

        // Toggle la classe paused sur l'equalizer
        if (equalizer) {
          equalizer.classList.toggle("paused");
        }
      });
    });
  }

  // Appeler la fonction au chargement
  initializeEqualizerToggle();
});
