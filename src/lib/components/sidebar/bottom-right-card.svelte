<script lang="ts">
  import { settings } from '$lib/stores/store';
  
</script>

<div class="fixed bottom-8 right-8 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-2xl z-20 border border-blue-50 text-center">
    <p class="text-lg font-semibold mb-1 uppercase tracking-widest">扫码点餐</p>
  <img src={$settings.qrCodeUrl} alt="QR" class="w-28 h-28 mb-2 rounded-lg" />
</div>