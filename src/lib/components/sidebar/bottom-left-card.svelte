<script lang="ts">
  import { wifi } from '$lib/stores/store';
</script>

<div class="fixed bottom-8 left-8 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-2xl z-20 border border-blue-50">
  <p class="text-lg text-blue-400 font-semibold mb-1 uppercase tracking-widest">WiFi</p>
  <p class="text-lg font-medium text-gray-800">名称：{$wifi.name}</p>
  <p class="text-lg font-medium text-gray-800">密码：{$wifi.password}</p>
</div>