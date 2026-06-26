<script lang="ts">
  import { Save, Loader2, TriangleAlert, Upload, Link2, Trash2 } from "@lucide/svelte";
  import type { Dish, DishCategory } from "$lib/stores/dish-store";
  import { categoryOptions, effectivePrice, discountDisplay } from "$lib/stores/dish-store";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Input from "$lib/components/ui/input/index.js";
  import * as Label from "$lib/components/ui/label/index.js";
  import * as Button from "$lib/components/ui/button/index.js";

  let {
    open = $bindable(false),
    mode,
    dish = null,
    onsubmit,
    onclose,
  }: {
    open: boolean;
    mode: "add" | "edit";
    dish?: Dish | null;
    onsubmit: (data: {
      id: string;
      name: string;
      price: string;
      image: string;
      discount: number;
      category: DishCategory;
    }) => Promise<void>;
    onclose: () => void;
  } = $props();

  let name = $state("");
  let price = $state("");
  let image = $state("");
  let discount = $state(1.0);
  let category = $state<DishCategory>("hot");
  let formError = $state("");
  let submitting = $state(false);

  // ── Image mode ────────────────────────────────────────
  type ImageMode = 'url' | 'upload';
  let imageMode = $state<ImageMode>('url');
  let imagePreview = $state("");
  let uploadError = $state("");

  $effect(() => {
    if (open) {
      name = dish?.name ?? "";
      price = dish?.price != null ? String(dish.price) : "";
      const img = dish?.image ?? '';
      image = img;
      imagePreview = img;
      if (img.startsWith('data:')) {
        imageMode = 'upload';
      } else {
        imageMode = 'url';
      }
      discount = dish?.discount ?? 1.0;
      category = dish?.category ?? "hot";
      formError = "";
      uploadError = "";
      submitting = false;
    }
  });

  function handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { uploadError = '图片大小不能超过 2MB'; return; }
    if (!file.type.startsWith('image/')) { uploadError = '请选择图片文件'; return; }
    uploadError = '';
    const reader = new FileReader();
    reader.onload = () => { const dataUri = reader.result as string; image = dataUri; imagePreview = dataUri; };
    reader.onerror = () => { uploadError = '读取文件失败'; };
    reader.readAsDataURL(file);
  }

  function clearImage() {
    image = ''; imagePreview = ''; uploadError = '';
    const input = document.getElementById('dish-file-upload') as HTMLInputElement;
    if (input) input.value = '';
  }

  function updateUrlPreview(value: string) {
    image = value; imagePreview = value.trim();
  }

  async function submit() {
    formError = "";
    if (!name.trim()) {
      formError = "请输入菜品名称";
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      formError = "请输入有效的正数价格";
      return;
    }
    submitting = true;
    try {
      await onsubmit({
        id: dish?.id ?? "",
        name: name.trim(),
        price: String(price),
        image: image.trim(),
        discount,
        category,
      });
    } catch (e) {
      console.error("菜品提交失败:", e);
      const msg =
        e instanceof Error ? e.message
        : typeof e === "string" ? e
        : JSON.stringify(e, null, 2);
      formError = msg || "操作失败，请重试";
    } finally {
      submitting = false;
    }
  }

  function hideImageOnError(e: Event) {
    (e.target as HTMLImageElement).style.display = "none";
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content onclose={onclose} class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>{mode === "add" ? "添加菜品" : "编辑菜品"}</Dialog.Title>
      <Dialog.Description>
        {mode === "add" ? "添加一道新菜品到菜单中" : "修改菜品信息"}
      </Dialog.Description>
    </Dialog.Header>

    <div class="space-y-4 py-4">
      <!-- 名称 -->
      <div class="space-y-2">
        <Label.Root for="dish-name">
          菜品名称 <span class="text-destructive">*</span>
        </Label.Root>
        <Input.Root id="dish-name" bind:value={name} placeholder="例：清炒时蔬" />
      </div>

      <!-- 价格 + 分类 -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label.Root for="dish-price">
            价格 (元) <span class="text-destructive">*</span>
          </Label.Root>
          <Input.Root id="dish-price" type="number" bind:value={price} placeholder="0.00" min="0" step="0.5" />
        </div>
        <div class="space-y-2">
          <Label.Root for="dish-category">分类</Label.Root>
          <select
            id="dish-category"
            bind:value={category}
            class="h-9 w-full rounded-4xl border border-input bg-input/30 px-3 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          >
            {#each categoryOptions as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- 折扣滑块 -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <Label.Root>折扣</Label.Root>
          <span class="text-sm font-semibold">
            {#if discount >= 1}
              原价
            {:else}
              {discountDisplay(discount)}
              {#if price}
                <span class="text-muted-foreground font-normal text-xs ml-1">
                  → ¥{effectivePrice(price, discount)}
                </span>
              {/if}
            {/if}
          </span>
        </div>
        <input
          type="range"
          bind:value={discount}
          min="0.1"
          max="1"
          step="0.05"
          class="w-full h-1.5 rounded-full accent-primary cursor-pointer"
        />
        <div class="flex justify-between text-xs text-muted-foreground select-none">
          <span>1折</span><span>5折</span><span>原价</span>
        </div>
      </div>

      <!-- 图片 -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <Label.Root>菜品图片 <span class="text-muted-foreground font-normal text-xs">（可选）</span></Label.Root>
          <div class="flex rounded-lg border border-border bg-muted/50 p-0.5">
            <button
              class="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all {imageMode === 'url' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}"
              onclick={() => (imageMode = "url")}
            >
              <Link2 size={12} />URL
            </button>
            <button
              class="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all {imageMode === 'upload' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}"
              onclick={() => (imageMode = "upload")}
            >
              <Upload size={12} />上传
            </button>
          </div>
        </div>

        {#if imageMode === "url"}
          <Input.Root
            id="dish-image"
            value={image}
            oninput={(e) => updateUrlPreview(e.currentTarget.value)}
            placeholder="https://..."
          />
        {:else}
          <div class="space-y-2">
            {#if !image}
              <label
                for="dish-file-upload"
                class="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border/70 bg-muted/30 px-4 py-6 text-center transition-colors hover:border-primary/40 hover:bg-muted/50"
              >
                <Upload size={20} class="text-muted-foreground" />
                <span class="text-sm text-muted-foreground">点击选择图片</span>
                <span class="text-xs text-muted-foreground/60">支持 JPG、PNG、WebP，最大 2MB</span>
                <input
                  id="dish-file-upload"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  onchange={handleFileSelect}
                />
              </label>
            {:else}
              <div class="flex items-center gap-2">
                <span class="flex-1 truncate text-xs text-muted-foreground">已上传 (base64)</span>
                <Button.Root
                  variant="ghost"
                  size="xs"
                  onclick={clearImage}
                  class="text-destructive hover:text-destructive"
                >
                  <Trash2 size={12} />移除
                </Button.Root>
              </div>
            {/if}
          </div>
        {/if}

        {#if uploadError}
          <p class="text-xs text-destructive">{uploadError}</p>
        {/if}

        {#if imagePreview}
          <div class="overflow-hidden rounded-lg bg-muted h-32">
            <img
              src={imagePreview}
              alt="预览"
              class="w-full h-full object-cover"
              onerror={hideImageOnError}
            />
          </div>
        {/if}
      </div>

      <!-- 错误提示 -->
      {#if formError}
        <div class="flex items-center gap-2 text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-2.5 text-sm">
          <TriangleAlert size={13} />
          {formError}
        </div>
      {/if}
    </div>

    <Dialog.Footer>
      <Button.Root variant="outline" onclick={onclose}>取消</Button.Root>
      <Button.Root onclick={submit} disabled={submitting}>
        {#if submitting}
          <Loader2 size={14} class="animate-spin" />
          处理中…
        {:else}
          <Save size={14} />
          {mode === "add" ? "确认添加" : "保存更改"}
        {/if}
      </Button.Root>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
