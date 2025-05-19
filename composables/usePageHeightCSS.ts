import { onMounted } from 'vue'

export default function usePageHeightCSS() {
  function updatePageHeightVar() {
    const cssCustomProp = '--page-height'
    const pageHeight = `${document.documentElement.scrollHeight}px`;
    if (document.documentElement.style.getPropertyValue(cssCustomProp) !== pageHeight) {
      document.documentElement.style.setProperty(cssCustomProp, pageHeight);
    }
  }

  onMounted(() => {
    // Observe changes to the document body
    const resizeObserver = new ResizeObserver(updatePageHeightVar);
    resizeObserver.observe(document.body);

    // Also update on initial load and resize
    window.addEventListener('load', updatePageHeightVar);
    window.addEventListener('resize', updatePageHeightVar);
  })
}