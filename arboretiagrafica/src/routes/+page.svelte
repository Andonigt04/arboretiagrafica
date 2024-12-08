<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import Header from "@components/header.svelte";
  import Footer from "@components/footer.svelte";
  import { slider, filters } from "@components/utils.js";

  const slide_total = slider.length;
  let slider_current = 0;

  let img_total = 0;
  let img_current = 0;

  let consteiner_gallery;

  let container_scaled;

  let panel;

  function closeImg() {
    img_current = 0;
    container_scaled.innerHTML = "";
    panel.classList.add("hidden");
  }

  function createImageElement({ src, alt, className }) {
    const image = document.createElement("img");
    image.src = src;
    image.alt = alt || "";
    image.className = className;
    return image;
  }

  function imgMove(curr, total, to) {
    const next = curr + to;

    if (next >= 0 && next < total) {
      img_current = next;

      const wrapper = container_scaled.querySelector("div");
      if (wrapper) {
        wrapper.style.transform = `translateX(-${img_current * 100}%)`;
      }
    }
  }

  function checkArrows(curr, total, offset) {
    return curr + offset >= 0 && curr + offset < total;
  }

  function showScaledImg(title) {
    // Buscar imágenes relacionadas
    const titleData = filters.find((filter) =>
      filter.images.some((img) => img.alt === title)
    );

    if (!titleData) {
      console.error(`No se encontraron imágenes para el título: ${title}`);
      return;
    }

    const matchedImages = titleData.images.filter((img) => img.alt === title);

    img_total = matchedImages.length;
    img_current = 0; // Mostrar la primera imagen al abrir

    // Limpiar contenedor y mostrar
    container_scaled.innerHTML = "";
    container_scaled.classList.remove("hidden");

    // Crear una envoltura para la transición de imágenes
    const wrapper = document.createElement("div");
    wrapper.className = "flex transition-transform duration-300 w-full";
    wrapper.style.width = `${img_total * 100}%`;

    matchedImages.forEach((img) => {
      const image = createImageElement({
        src: img.src,
        alt: img.alt,
        className: "w-full h-auto object-contain flex-shrink-0",
      });
      wrapper.appendChild(image);
    });

    container_scaled.appendChild(wrapper);

    // Mostrar el panel para navegación
    panel.classList.remove("hidden");
  }

  function slide() {
    moveSlider(slider_current, slide_total, 1, (value) => {
      slider_current = value;
    });
  }

  async function moveSlider(curr, totalSlides, offset, setSlide) {
    const nextSlide = curr + offset;

    if (nextSlide >= 0 && nextSlide < totalSlides) {
      setSlide(nextSlide);
    } else {
      // Reinicia el índice al llegar al final
      setSlide(offset > 0 ? 0 : totalSlides - 1);
    }
  }

  function showGallery(category) {
    const displayedAlts = new Set(); // Conjunto para rastrear los nombres únicos

    // Encontrar la categoría seleccionada
    const categoryData = filters.find((filter) => filter.category === category);

    consteiner_gallery.innerHTML = "";

    if (categoryData) {
      categoryData.images.forEach((img) => {
        if (!displayedAlts.has(img.alt)) {
          // Mostrar solo la primera imagen de cada nombre
          consteiner_gallery.appendChild(
            addGalleryImages(img.src, img.alt, img.filts)
          );
          displayedAlts.add(img.alt); // Agregar el nombre al conjunto
        }
      });
    }
  }

  function addGalleryImages(src, alt, txt) {
    const img_container = document.createElement("div");
    const img_txt_container = document.createElement("div");
    const img_txt = document.createElement("p");
    const img = document.createElement("img");

    // Clases
    img_container.className = "relative p-2 w-fit h-fit overflow-hidden";
    img_txt_container.className =
      "peer peer-hover:flex hidden absolute top-0 left-0 items-center justify-center bg-black bg-opacity-70 w-full h-full";
    img_txt.className = "text-white text-center p-2";
    img.className = "peer transition-transform duration-300 aspect-square";

    img.src = src;
    img.alt = alt;
    img_txt.textContent = txt;

    // Anidar elementos correctamente
    img_txt_container.appendChild(img_txt);
    img_container.appendChild(img);
    img_container.appendChild(img_txt_container);

    img_container.addEventListener("click", () => showScaledImg(alt));

    return img_container;
  }

  onMount(() => {
    showGallery("todo");

    const interval = setInterval(() => {
      slide();
    }, 5000);

    return () => clearInterval(interval);
  });
</script>

<div class="bg-orange-50 max-w-full">
  <div class="min-h-screen lg:mx-52">
    <Header />
    <main class="overflow-hidden">
      <section>
        <div>
          <ul
            class="flex flex-row w-full"
            style="transform: translateX(calc({-slider_current} * 100%)); 
            transition-timing-function: ease; transition-duration: .8s;"
          >
            {#each slider as img}
              <li class="w-full min-w-full">
                <img src={img.src} alt={img.name} />
              </li>
            {/each}
          </ul>
        </div>
      </section>
      <section>
        <div class="bg-pink px-8 py-5">
          <h1 class="text-blue font-bold text-3xl">¡HOLA!</h1>
          <p class="text-blue text-xl pt-6">
            Soy Marta Torres, diseñadora gráfica a tiempo completo y dibujanta a
            tiempo robado (de Bilbao, por cierto). Este es el espacio donde
            alojar las viñetas, juegos de palabras y palabros en general que
            aparecen por mi cabeza.<br /><br /> Si te apetece colaborar para
            hacer cosas chulas, contacta
            <a
              class="underline"
              href="http://"
              target="_blank"
              rel="noopener noreferrer">aquí</a
            >.
          </p>
        </div>
      </section>
      <section>
        <div class="mt-10 max-w-96">
          {#each filters as filter}
            <button
              on:click={showGallery(filter.category)}
              class="border-solid border-1 border-gray-600 m-1 px-1"
              type="button">{filter.category}</button
            >
          {/each}
        </div>
        <div
          class="grid max-md:grid-cols-2 lg:grid-cols-4"
          bind:this={consteiner_gallery}
        ></div>
      </section>
    </main>
  </div>
  <Footer />
  <div
    bind:this={panel}
    class="bg-orange-50 top-0 right-0 h-screen w-screen hidden fixed flex justify-between"
  >
    {#if checkArrows(img_current, img_total, -1)}
      <button class="w-1/2 h-screen absolute left-0 self-center justify-end cursor-pointer  max-md:top-2/5" on:click={() => imgMove(img_current, img_total, -1)} type="button"
        ><img
          class="w-2/12 rotate-180 ml-32 absolute left-0"
          src="/src/img/WEB/SLIDER/FLECHA _SLIDER.png"
          alt="left"
        /></button
      >
    {/if}
    {#if checkArrows(img_current, img_total, 1)}
      <button
        class="w-1/2 h-screen absolute right-0 self-center justify-end cursor-pointer max-md:top-2/5"
        on:click={() => imgMove(img_current, img_total, 1)}
        type="button"
        ><img
          class="w-2/12 mr-32 absolute right-0"
          src="/src/img/WEB/SLIDER/FLECHA _SLIDER.png"
          alt="right"
        /></button
      >
    {/if}
    <button class="top-0 right-0 absolute w-fit flex justify-end" on:click={() => closeImg()} type="button"><img class="w-3/12" src="/src/img/WEB/SLIDER/x-transparent-background-free-png.webp" alt="close-img"></button>
  </div>
  <div
    bind:this={container_scaled}
    class="fixed max-md:top-0 max-md:w-screen top-h/6 left-1/3 w-1/3 max-md:left-0 max-md:top-1/4 max-md:align-middle justify-center max-md:w-2/3 flex items-center hidden overflow-hidden"
  ></div>
</div>
