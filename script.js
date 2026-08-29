/**
 * ==========================================================================
 * JARDINERÍA EL AMANECER - SCRIPT PRINCIPAL (script.js)
 * ==========================================================================
 * Este archivo controla la interactividad de la página:
 * 1. Menú móvil interactivo (abrir / cerrar / navegación suave).
 * 2. Efecto de barra superior al hacer scroll.
 * 3. Resaltado automático de sección activa en el menú.
 * 4. Animaciones de aparición suave al hacer scroll (Intersection Observer).
 * 5. Visor interactivo de fotografías (Lightbox) para la galería.
 * 6. Formulario inteligente que genera y abre el mensaje directo en WhatsApp.
 * 7. Actualización automática del año en el pie de página.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =======================================================================
       1. VARIABLES Y SELECTORES GLOBALES
       ======================================================================= */
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const currentYearSpan = document.getElementById('current-year');

    // Teléfono de contacto de Salvador para WhatsApp (con código de país de Ecuador: 593)
    const WHATSAPP_PHONE_PRIMARY = '593994273986';


    /* =======================================================================
       2. ACTUALIZACIÓN AUTOMÁTICA DEL AÑO DE DERECHOS RESERVADOS
       ======================================================================= */
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }


    /* =======================================================================
       3. MENÚ DE NAVEGACIÓN MÓVIL (ABRIR / CERRAR)
       ======================================================================= */
    if (navToggle && navbar) {
        // Alternar menú al pulsar el botón hamburguesa
        navToggle.addEventListener('click', () => {
            const isOpen = navbar.classList.contains('active');
            toggleMobileMenu(!isOpen);
        });

        // Cerrar el menú al hacer clic en cualquier enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbar.classList.contains('active')) {
                    toggleMobileMenu(false);
                }
            });
        });

        // Cerrar menú si el usuario hace clic fuera de la navegación
        document.addEventListener('click', (e) => {
            if (navbar.classList.contains('active') && !navbar.contains(e.target) && !navToggle.contains(e.target)) {
                toggleMobileMenu(false);
            }
        });
    }

    function toggleMobileMenu(open) {
        if (open) {
            navbar.classList.add('active');
            navToggle.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
        } else {
            navbar.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }


    /* =======================================================================
       4. CAMBIO DE APARIENCIA DEL HEADER AL HACER SCROLL
       ======================================================================= */
    const handleHeaderScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Ejecutar al cargar la página


    /* =======================================================================
       5. RESALTADO DE LA SECCIÓN ACTIVA EN EL MENÚ SEGÚN EL SCROLL
       ======================================================================= */
    const sections = document.querySelectorAll('section[id]');

    const highlightActiveNavLink = () => {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightActiveNavLink, { passive: true });


    /* =======================================================================
       6. ANIMACIONES DE APARICIÓN SUAVE AL HACER SCROLL (INTERSECTION OBSERVER)
       ======================================================================= */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Dejar de observar una vez que ya apareció
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12, // Se activa cuando el 12% del elemento es visible
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Si el navegador es antiguo y no soporta IntersectionObserver, mostrar directamente
        revealElements.forEach(el => el.classList.add('is-visible'));
    }


    /* =======================================================================
       7. VISOR DE FOTOGRAFÍAS AMPLIADAS (LIGHTBOX)
       ======================================================================= */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentGalleryIndex = 0;
    const galleryData = [];

    // Recopilar información de cada elemento de la galería
    galleryItems.forEach((item, index) => {
        const src = item.getAttribute('data-image-src');
        const title = item.getAttribute('data-image-title') || 'Trabajo de Jardinería';
        const desc = item.getAttribute('data-image-desc') || '';

        galleryData.push({ src, title, desc });

        // Evento de clic para abrir el lightbox
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentGalleryIndex = index;
        updateLightboxContent();
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restaurar scroll
    }

    function updateLightboxContent() {
        const currentItem = galleryData[currentGalleryIndex];
        if (currentItem) {
            lightboxImg.src = currentItem.src;
            lightboxImg.alt = currentItem.title;
            lightboxTitle.textContent = currentItem.title;
            lightboxDesc.textContent = currentItem.desc;
        }
    }

    function showPrevImage() {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
        updateLightboxContent();
    }

    function showNextImage() {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
        updateLightboxContent();
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);

    // Controles por teclado (Escape para cerrar, Flechas para navegar)
    document.addEventListener('keydown', (e) => {
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    });


    /* =======================================================================
       8. FORMULARIO INTERACTIVO DE CONTACTO (ENVÍO DIRECTO A WHATSAPP)
       ======================================================================= */
    const whatsappForm = document.getElementById('whatsapp-form');

    if (whatsappForm) {
        whatsappForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evitar recarga tradicional de la página

            const name = document.getElementById('form-name').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const service = document.getElementById('form-service').value;
            const message = document.getElementById('form-message').value.trim();

            if (!name || !service || !message) {
                alert('Por favor completa todos los campos requeridos para enviar tu mensaje.');
                return;
            }

            // Construir el mensaje de WhatsApp estructurado y cordial
            let textMessage = `🌿 *CONSULTA - JARDINERÍA EL AMANECER* 🌿\n\n`;
            textMessage += `👤 *Cliente:* ${name}\n`;
            if (phone) {
                textMessage += `📞 *Teléfono:* ${phone}\n`;
            }
            textMessage += `🌱 *Servicio de interés:* ${service}\n\n`;
            textMessage += `📝 *Detalles del trabajo:* \n${message}\n\n`;
            textMessage += `_Mensaje enviado desde la página web oficial._`;

            // Codificar el texto para URL
            const encodedText = encodeURIComponent(textMessage);
            const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_PRIMARY}?text=${encodedText}`;

            // Abrir WhatsApp en una nueva pestaña
            window.open(whatsappUrl, '_blank');
        });
    }

});
