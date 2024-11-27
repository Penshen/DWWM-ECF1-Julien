document.addEventListener("DOMContentLoaded", () => {
  // Ajout du code pour le menu burger au début du fichier
  const menuToggle = document.querySelector(".menu-toggle");
  const menuOverlay = document.querySelector(".menu-overlay");
  const closeMenu = document.querySelector(".close-menu");

  if (menuToggle && menuOverlay && closeMenu) {
    menuToggle.addEventListener("click", () => {
      menuOverlay.classList.add("active");
    });

    closeMenu.addEventListener("click", () => {
      menuOverlay.classList.remove("active");
    });

    // Fermer le menu quand on clique sur un lien
    const mobileNavLinks = document.querySelectorAll(".mobile-nav a");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuOverlay.classList.remove("active");
      });
    });
  }

  // Vérifier d'abord quelle page nous sommes
  const isProgramPage = window.location.pathname.includes("program.html");
  const isInfoPage = window.location.pathname.includes("info.html");
  const isTicketsPage = window.location.pathname.includes("tickets.html");

  // Gestion de la page programme
  if (isProgramPage) {
    const programDays = document.querySelector(".program-days");

    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    function createArtistCard(artistData) {
      const card = document.createElement("div");
      card.className = "card";

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
      infoButton.className = "info-button";
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
            const card = createArtistCard(artist);
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
    let hidingSoldOut = false;
    let currentPriceSort = "asc";
    const dateFilter = document.getElementById("date-filter");
    const dateDropdown = document.getElementById("date-dropdown");
    let selectedDate = "all";

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

    // Fonction pour formater la date dans un format lisible
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    // Fonction pour filtrer les cartes
    function filterCards() {
      const searchTerm = searchInput.value.toLowerCase();
      const cards = document.querySelectorAll(".card, .card-reverse");

      cards.forEach((card) => {
        const artistData = card.artistData;
        const artistName = card
          .querySelector(".band-name")
          .textContent.toLowerCase();
        const description = card
          .querySelector(".description")
          .textContent.toLowerCase();
        const cardDate = artistData.date;
        const remainingTickets = 1000 - artistData.ticketsSold;
        const isSoldOut = remainingTickets < 5;

        const matchesDate = selectedDate === "all" || cardDate === selectedDate;
        const matchesSearch =
          artistName.includes(searchTerm) || description.includes(searchTerm);

        if (matchesSearch && matchesDate && !(hidingSoldOut && isSoldOut)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });

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
          hidingSoldOut
            ? "Afficher tous les événements"
            : "Masquer les SOLD OUT"
        );
        filterCards();
      });
    }

    // Fonction de réinitialisation mise à jour
    function resetFilters() {
      // Réinitialiser la recherche
      if (searchInput) {
        searchInput.value = "";
      }

      // Réinitialiser le filtre SOLD OUT
      if (hideButton) {
        hidingSoldOut = false;
        hideButton.classList.remove("active");
        updateButtonContent(hideButton, "🎫", "Masquer les SOLD OUT");
      }

      // Réinitialiser le tri par prix
      if (sortPriceButton) {
        currentPriceSort = "asc";
        sortPriceButton.setAttribute("data-sort", "asc");
        updateButtonContent(sortPriceButton, "💰", "Prix: Croissant");
      }

      // Réinitialiser le filtre de date
      if (dateFilter && dateDropdown) {
        selectedDate = "all";
        const allDatesOption = document.querySelector('input[value="all"]');
        if (allDatesOption) {
          allDatesOption.checked = true;
        }
        updateButtonContent(dateFilter, "📅", "Dates");
        dateFilter.classList.remove("active");
        dateDropdown.classList.remove("active");
      }

      // Recharger et réafficher toutes les cartes dans leur ordre initial
      fetch("data/festival.json")
        .then((response) => response.json())
        .then((data) => {
          if (!cardsContainer) return;

          cardsContainer.innerHTML = "";

          // Trier par date et heure
          const sortedArtists = data.sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            return dateA - dateB;
          });

          sortedArtists.forEach((artistData, index) => {
            const card = createArtistCard(artistData, index);
            cardsContainer.appendChild(card);
          });

          updateCardStyles();
        })
        .catch((error) => {
          console.error("Erreur lors de la réinitialisation:", error);
          if (cardsContainer) {
            cardsContainer.innerHTML = `<p style="color: white;">Erreur lors du chargement des données: ${error.message}</p>`;
          }
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

    // Fonction pour créer les options de dates à partir des données
    function createDateOptions(data) {
      if (!dateDropdown) return;

      // Récupérer les dates uniques du JSON
      const uniqueDates = [
        ...new Set(data.map((artist) => artist.date)),
      ].sort();

      // Créer le contenu HTML pour les options de dates
      const dateOptionsHTML = `
        <div class="date-options">
          <label>
            <input type="radio" name="date" value="all" checked>
            <span>Toutes les dates</span>
          </label>
          ${uniqueDates
            .map(
              (date) => `
            <label>
              <input type="radio" name="date" value="${date}">
              <span>${formatDate(date)}</span>
            </label>
          `
            )
            .join("")}
        </div>
      `;

      // Insérer les options dans le dropdown
      dateDropdown.innerHTML = dateOptionsHTML;

      // Ajouter les écouteurs d'événements pour les nouvelles options
      const dateOptions = document.querySelectorAll('input[name="date"]');
      dateOptions.forEach((option) => {
        option.addEventListener("change", (e) => {
          selectedDate = e.target.value;
          const selectedText =
            e.target.value === "all"
              ? "Toutes les dates"
              : formatDate(e.target.value);

          updateButtonContent(dateFilter, "📅", selectedText);
          dateDropdown.classList.remove("active");
          dateFilter.classList.remove("active");

          filterCards();
        });
      });
    }

    // Modifier la partie du code qui charge les données JSON
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

        // Créer les options de dates avant de trier les artistes
        createDateOptions(data);

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

    // Ajouter ces gestionnaires d'événements après l'initialisation des variables
    if (dateFilter && dateDropdown) {
      // Initialiser le texte du bouton
      updateButtonContent(dateFilter, "📅", "Dates");

      // Gestionnaire pour le bouton de filtre par date
      dateFilter.addEventListener("click", (e) => {
        e.stopPropagation(); // Empêcher la propagation au document
        dateFilter.classList.toggle("active");
        dateDropdown.classList.toggle("active");
      });

      // Fermer le dropdown quand on clique ailleurs sur la page
      document.addEventListener("click", (e) => {
        if (
          !dateFilter.contains(e.target) &&
          !dateDropdown.contains(e.target)
        ) {
          dateFilter.classList.remove("active");
          dateDropdown.classList.remove("active");
        }
      });
    }

    // Ajouter l'écouteur d'événement pour le bouton reset
    if (resetButton) {
      resetButton.addEventListener("click", resetFilters);
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
