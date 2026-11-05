(function () {
  "use strict";

  var select = function (selector, all) {
    return all
      ? Array.prototype.slice.call(document.querySelectorAll(selector))
      : document.querySelector(selector);
  };

  /* ------------------------------------------------------------------ *
   * Mobile navigation
   * ------------------------------------------------------------------ */
  var navbar = select("#navbar");
  var navToggle = select(".mobile-nav-toggle");

  function closeMobileNav() {
    if (navbar && navbar.classList.contains("navbar-mobile")) {
      navbar.classList.remove("navbar-mobile");
      if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    }
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var open = navbar.classList.toggle("navbar-mobile");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        var firstLink = navbar.querySelector(".nav-link");
        if (firstLink) firstLink.focus({ preventScroll: true });
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Section switching
   * ------------------------------------------------------------------ */
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showSection(hash) {
    var section = select(hash);
    var header = select("#header");
    if (!section || !header) return false;

    var navLinks = select("#navbar .nav-link", true);
    navLinks.forEach(function (item) {
      item.classList.toggle("active", item.getAttribute("href") === hash);
    });

    closeMobileNav();

    if (hash === "#header") {
      header.classList.remove("header-top");
      select("section", true).forEach(function (item) {
        item.classList.remove("section-show");
      });
      return true;
    }

    if (!header.classList.contains("header-top")) {
      header.classList.add("header-top");
      window.setTimeout(function () {
        select("section", true).forEach(function (item) {
          item.classList.remove("section-show");
        });
        section.classList.add("section-show");
      }, 350);
    } else {
      select("section", true).forEach(function (item) {
        item.classList.remove("section-show");
      });
      section.classList.add("section-show");
    }

    return true;
  }

  document.querySelectorAll('#navbar .nav-link').forEach(function (link) {
    link.addEventListener("click", function (event) {
      if (showSection(this.hash)) {
        event.preventDefault();
        scrollToTop();
      }
    });
  });

  /* Show the section referenced by the URL hash on load */
  window.addEventListener("load", function () {
    var hash = window.location.hash;
    if (!hash) return;

    var initial = select(hash);
    if (!initial) return;

    select("#header").classList.add("header-top");
    select("#navbar .nav-link", true).forEach(function (item) {
      item.classList.toggle("active", item.getAttribute("href") === hash);
    });

    window.setTimeout(function () {
      initial.classList.add("section-show");
    }, 350);
    scrollToTop();
  });

  /* ------------------------------------------------------------------ *
   * Blog tag filter (replaces Isotope)
   * ------------------------------------------------------------------ */
  var filterList = select("#portfolio-flters");
  if (filterList) {
    var items = select(".portfolio-container .portfolio-item", true);
    filterList.addEventListener("click", function (event) {
      var target = event.target.closest("li[data-filter]");
      if (!target) return;

      filterList.querySelectorAll("li").forEach(function (li) {
        li.classList.remove("filter-active");
      });
      target.classList.add("filter-active");

      var filter = target.getAttribute("data-filter");
      items.forEach(function (item) {
        item.hidden = filter !== "*" && !item.classList.contains(filter.slice(1));
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Lightbox for portfolio cards and blog posts
   * Loads the target page in an iframe only when it is opened.
   * ------------------------------------------------------------------ */
  var detailLinks = select(".portfolio-details-lightbox", true);
  if (detailLinks.length) {
    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.hidden = true;
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.innerHTML =
      '<div class="lightbox-panel">' +
      '<button class="lightbox-close" type="button" aria-label="Close">&times;</button>' +
      '<iframe title="Project details" allowfullscreen></iframe>' +
      "</div>";
    document.body.appendChild(lightbox);

    var frame = lightbox.querySelector("iframe");
    var closeButton = lightbox.querySelector(".lightbox-close");
    var lastFocused = null;

    function openLightbox(url, title, trigger) {
      lastFocused = trigger || document.activeElement;
      frame.title = title || "Project details";
      frame.src = url;
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      closeButton.focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      frame.src = "about:blank";
      document.body.classList.remove("lightbox-open");
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    detailLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        if (event.defaultPrevented || event.button !== 0 ||
            event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }
        event.preventDefault();
        openLightbox(link.href, link.textContent.trim(), link);
      });
    });

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (event) {
      if (!lightbox.hidden && event.key === "Escape") closeLightbox();
    });
  }
})();
