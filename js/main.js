// Initialize audio functionality when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("background-music");
  const equalizer = document.querySelector(".equalizer");
  const equalizerToggle = document.querySelector(".equalizer-toggle");

  if (audio && equalizer && equalizerToggle) {
    // Restore previous audio session state
    const savedTime = parseFloat(localStorage.getItem("audioTime") || "0");
    audio.currentTime = savedTime;

    // Handle play/pause toggling and update UI accordingly
    const togglePlayPause = () => {
      if (audio.paused) {
        // Attempt to play audio and update UI state
        audio
          .play()
          .then(() => {
            equalizer.classList.remove("paused");
            equalizerToggle.classList.remove("paused");
            localStorage.setItem("audioPlaying", "true");
          })
          .catch((error) => {
            console.error("Audio playback failed:", error);
            equalizer.classList.add("paused");
            equalizerToggle.classList.add("paused");
            localStorage.setItem("audioPlaying", "false");
          });
      } else {
        // Pause
        audio.pause();
        equalizer.classList.add("paused");
        equalizerToggle.classList.add("paused");
        localStorage.setItem("audioPlaying", "false");
      }
    };

    // Click event for the toggle button
    equalizerToggle.addEventListener("click", togglePlayPause);

    // Update state when audio ends
    audio.addEventListener("ended", () => {
      equalizer.classList.add("paused");
      equalizerToggle.classList.add("paused");
      localStorage.setItem("audioPlaying", "false");
    });

    // Update state when audio is paused
    audio.addEventListener("pause", () => {
      equalizer.classList.add("paused");
      equalizerToggle.classList.add("paused");
      localStorage.setItem("audioPlaying", "false");
    });

    // Update state when audio plays
    audio.addEventListener("play", () => {
      equalizer.classList.remove("paused");
      equalizerToggle.classList.remove("paused");
      localStorage.setItem("audioPlaying", "true");
    });

    // Persist audio playback position every second while playing
    setInterval(() => {
      if (!audio.paused) {
        localStorage.setItem("audioTime", audio.currentTime.toString());
      }
    }, 1000);

    // Save audio position when user leaves/minimizes page
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        localStorage.setItem("audioTime", audio.currentTime.toString());
      }
    });

    // Attempt autoplay when page loads (may be blocked by browser)
    audio
      .play()
      .then(() => {
        equalizer.classList.remove("paused");
        equalizerToggle.classList.remove("paused");
        localStorage.setItem("audioPlaying", "true");
      })
      .catch((error) => {
        console.log("Autoplay blocked:", error);
        equalizer.classList.add("paused");
        equalizerToggle.classList.add("paused");
        localStorage.setItem("audioPlaying", "false");
      });
  }

  // Helper function to format dates in French locale
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Determine current page for conditional feature loading
  const isProgramPage = window.location.pathname.includes("program.html");
  const isInfoPage = window.location.pathname.includes("info.html");
  const isTicketsPage = window.location.pathname.includes("tickets.html");

  // Mobile menu functionality
  const menuToggle = document.querySelector(".burger-menu");
  const menuOverlay = document.querySelector(".menu-overlay");
  const closeMenu = document.querySelector(".close-menu");
  const body = document.body;

  if (menuToggle && menuOverlay && closeMenu) {
    // Toggle mobile menu visibility and body scroll
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

  // Program page specific functionality
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
    return;
  }

  // Info page specific functionality
  if (isInfoPage) {
    // Toggle section functionality
    const toggleButtons = document.querySelectorAll(".toggle-button");

    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Get the content element
        const content = document.getElementById(
          button.getAttribute("aria-controls")
        );
        const isExpanded = button.getAttribute("aria-expanded") === "true";

        // Toggle button state
        button.setAttribute("aria-expanded", !isExpanded);

        // Toggle content visibility
        if (content) {
          content.classList.toggle("active");
          content.hidden = isExpanded;

          // Toggle plus/minus icon
          const icon = button.querySelector(".toggle-icon");
          if (icon) {
            icon.textContent = isExpanded ? "+" : "-";
          }
        }
      });
    });
    return;
  }

  // Tickets page specific functionality
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

    // Function to create ticket cards
    function createTicketCard(artistData, isReverse = false) {
      const card = document.createElement("div");
      card.className = isReverse ? "card-reverse" : "card";
      card.artistData = artistData;

      // Calculate if sold out
      const remainingTickets = 1000 - artistData.ticketsSold;
      const isSoldOut = remainingTickets < 5;

      // Add sold-out data attribute to the card
      if (isSoldOut) {
        card.setAttribute("data-sold-out", "true");
      }

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

      // Add date and time
      const dateTimeContainer = document.createElement("div");
      dateTimeContainer.className = "datetime-container";

      const dateTime = document.createElement("p");
      dateTime.className = "datetime";

      // Format date
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

      const ticketsText = document.createElement("span");
      ticketsText.className = "tickets-text";
      ticketsText.textContent = isSoldOut
        ? "SOLD OUT"
        : `${remainingTickets} places restantes`;

      progressContainer.setAttribute("data-sold-out", isSoldOut);
      progressContainer.title = `${artistData.ticketsSold}/1000 tickets sold`;

      progressContainer.appendChild(progressBar);
      progressContainer.appendChild(ticketsText);

      // Reservation section
      const reservation = document.createElement("div");
      reservation.className = "reservation";

      const reserveButton = document.createElement("button");
      reserveButton.className = "reserve-button";
      reserveButton.textContent = isSoldOut
        ? "SOLD OUT"
        : "JE RÉSERVE MA PLACE !";
      if (!isSoldOut) {
        reserveButton.addEventListener("click", () => {
          // Your reservation logic here
        });
      }

      const price = document.createElement("span");
      price.className = "price";
      price.textContent = `${artistData.price} €`;

      reservation.appendChild(reserveButton);
      reservation.appendChild(price);

      // Assemble the card
      cardContent.appendChild(bandName);
      cardContent.appendChild(dateTimeContainer);
      cardContent.appendChild(description);
      cardContent.appendChild(progressContainer);
      cardContent.appendChild(reservation);

      card.appendChild(cardImage);
      card.appendChild(cardContent);

      // Add badges
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

    // Function to create date filter options
    function createDateOptions(data) {
      if (!dateDropdown) return;

      const uniqueDates = [
        ...new Set(data.map((artist) => artist.date)),
      ].sort();

      dateDropdown.innerHTML = `
        <h3 class="dropdown-title">Filter by date</h3>
        <div class="date-option ${selectedDate === "all" ? "selected" : ""}">
          <input type="radio" name="date-filter" id="date-all" value="all" ${
            selectedDate === "all" ? "checked" : ""
          } hidden>
          <span class="radio-custom"></span>
          <label for="date-all">All dates</label>
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
        <button class="apply-button">Apply</button>
      `;
    }

    // Load data and create cards
    fetch("data/festival.json")
      .then((response) => response.json())
      .then((data) => {
        // Create initial cards
        data.forEach((artist, index) => {
          const card = createTicketCard(artist, index % 2 !== 0); // Alternate between normal and reverse
          cardsContainer.appendChild(card);
        });

        // Create date options
        createDateOptions(data);

        // Date dropdown handler
        if (dateFilter && dateDropdown) {
          dateFilter.addEventListener("click", (e) => {
            e.stopPropagation();
            dateDropdown.classList.toggle("active");
            dateFilter.classList.toggle("active");
          });

          // Date dropdown option handler
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

          // Apply button handler
          const applyButton = dateDropdown.querySelector(".apply-button");
          if (applyButton) {
            applyButton.addEventListener("click", () => {
              dateDropdown.classList.remove("active");
              dateFilter.classList.remove("active");
            });
          }

          // Close dropdown when clicking outside
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

        // Hide sold out button handler
        if (hideButton) {
          hideButton.addEventListener("click", () => {
            hidingSoldOut = !hidingSoldOut;
            hideButton.classList.toggle("active");
            filterCards();
          });
        }

        // Price sort button handler
        if (sortPriceButton) {
          sortPriceButton.addEventListener("click", () => {
            currentPriceSort = currentPriceSort === "asc" ? "desc" : "asc";
            sortPriceButton.innerHTML = `
              <span class="filter-icon">💰</span>
              <span class="button-text">Price: ${
                currentPriceSort === "asc" ? "Ascending" : "Descending"
              }</span>
            `;
            sortPriceButton.classList.toggle("active");
            sortCards();
          });
        }

        // Reset button handler
        if (resetButton) {
          resetButton.addEventListener("click", () => {
            // Reset all filters
            searchInput.value = "";
            hidingSoldOut = false;
            currentPriceSort = "asc";
            selectedDate = "all";

            // Reset active classes
            hideButton.classList.remove("active");
            sortPriceButton.classList.remove("active");
            dateFilter.classList.remove("active");
            dateDropdown.classList.remove("active");

            // Reset button texts
            sortPriceButton.innerHTML = `
              <span class="filter-icon">💰</span>
              <span class="button-text">Price: Ascending</span>
            `;
            dateFilter.innerHTML = `
              <span class="filter-icon">📅</span>
              <span class="button-text">Dates</span>
            `;

            // Reset the date radio buttons
            const allDatesRadio = dateDropdown.querySelector("#date-all");
            if (allDatesRadio) {
              allDatesRadio.checked = true;
            }

            // Reset the cards order to original state
            const cards = Array.from(
              cardsContainer.querySelectorAll(".card, .card-reverse")
            );
            cards.sort((a, b) => {
              const indexA = Array.from(cardsContainer.children).indexOf(a);
              const indexB = Array.from(cardsContainer.children).indexOf(b);
              return indexA - indexB;
            });

            // Reapply alternating styles and reinsert cards
            cards.forEach((card, index) => {
              card.className = index % 2 !== 0 ? "card-reverse" : "card";
              cardsContainer.appendChild(card);
            });

            // Reapply filters
            filterCards();
          });
        }

        // Function to sort cards by price
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

          // Reapply alternating styles after sorting
          cards.forEach((card, index) => {
            card.className = index % 2 !== 0 ? "card-reverse" : "card";
            cardsContainer.appendChild(card);
          });
        }

        // Search input handler
        if (searchInput) {
          searchInput.addEventListener("input", () => {
            filterCards();
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        cardsContainer.innerHTML = `<p style="color: white;">Error loading data: ${error.message}</p>`;
      });

    // Function to filter cards based on current criteria
    function filterCards() {
      const cards = cardsContainer.querySelectorAll(".card, .card-reverse");
      const searchTerm = searchInput.value.toLowerCase();

      // eslint-disable-next-line no-unused-vars
      let visibleCards = 0;
      // eslint-disable-next-line no-unused-vars
      let visibleSoldOutCards = 0;

      cards.forEach((card) => {
        const artistData = card.artistData;
        let shouldShow = true;

        // Search filter
        if (searchTerm) {
          shouldShow = artistData.artist.toLowerCase().includes(searchTerm);
        }

        // Date filter
        if (shouldShow && selectedDate !== "all") {
          shouldShow = artistData.date === selectedDate;
        }

        // SOLD OUT filter
        if (shouldShow && hidingSoldOut) {
          const remainingTickets = 1000 - artistData.ticketsSold;
          shouldShow = remainingTickets >= 5;
        }

        // Show or hide the card
        card.style.display = shouldShow ? "" : "none";

        // Count visible cards
        if (shouldShow) {
          visibleCards++;
          if (card.querySelector(".sold-out-badge")) {
            visibleSoldOutCards++;
          }
        }
      });

      // Update filter button text
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

  // Initialize equalizer animation toggle
  function initializeEqualizerToggle() {
    const toggleButton = document.querySelector(".equalizer-toggle");
    const equalizer = document.querySelector(".equalizer");

    if (toggleButton && equalizer) {
      toggleButton.addEventListener("click", function () {
        // Toggle the classes
        this.classList.toggle("paused");
        equalizer.classList.toggle("paused");
      });
    }
  }

  // Call the function at load
  initializeEqualizerToggle();
});
