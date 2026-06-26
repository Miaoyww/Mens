<script lang="ts">
  import { goto } from "$app/navigation";
  import GeneralPage from "$lib/components/welcome/pages/general-page.svelte";
  import { Button } from "$lib/components/ui/button";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import { globalSettings } from "$lib/stores/global-settings-store";
  import { fly } from "svelte/transition";
  import { ArrowLeftIcon, ArrowRightIcon, ChefHat } from "@lucide/svelte";
  import SectionNavButton from "$lib/components/welcome/section-nav-button.svelte";
  import DishPage from "$lib/components/welcome/pages/dish-page.svelte";

  type SectionKey = "general" | "dish";

  const sections: {
    key: SectionKey;
    label: string;
    description: string;
  }[] = [
    {
      key: "general",
      label: "偏好",
      description: "语言与主题配置",
    },
    {
      key: "dish",
      label: "菜单",
      description: "菜单配置",
    },
  ];

  let activeSection = $state<SectionKey>("general");
  let isSubmittingConfig = $state(false);
  let configErrorMessage = $state("");

  const activeIndex = $derived(
    sections.findIndex((section) => section.key === activeSection),
  );
  const isFirstSection = $derived(activeIndex === 0);
  const isLastSection = $derived(activeIndex === sections.length - 1);

  function selectPrevious() {
    if (!isFirstSection) {
      activeSection = sections[activeIndex - 1].key;
    }
  }

  function selectNext() {
    if (!isLastSection) {
      activeSection = sections[activeIndex + 1].key;
    }
  }

  function selectNextOrSubmit() {
    if (!isLastSection) {
      selectNext();
      return;
    }

    globalSettings.patch({ welcomeCompleted: true });
    goto("/dashboard");
  }
</script>

<svelte:head>
  <title>欢迎 · Mens 设置向导</title>
</svelte:head>

<main class="min-h-svh bg-muted/40 px-5 py-8 text-foreground md:px-8">
  <div
    class="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl items-center justify-center"
  >
    <section class="w-full">
      <div
        class="mx-auto mb-6 max-w-5xl md:pl-44"
        in:fly={{ y: 16, duration: 300, opacity: 0 }}
      >
        <div class="flex max-w-2xl flex-col gap-2">
          <p
            class="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground"
          >
            首次使用
          </p>
          <h1 class="text-3xl font-semibold tracking-tight md:text-4xl">
            欢迎使用 Mens
          </h1>
          <p class="text-sm text-muted-foreground md:text-base">
            先完成几个基础占位配置。每个配置区可以随时切换，不需要按顺序填写。
          </p>
        </div>
      </div>

      <div
        class="relative mx-auto flex max-w-5xl flex-col md:flex-row md:items-stretch"
        in:fly={{ y: 16, duration: 300, opacity: 0 }}
      >
        <nav
          aria-label="欢迎配置导航"
          class="z-10 mb-3 grid gap-2 md:mb-0 md:w-44 md:translate-x-px md:self-start md:pt-8"
        >
          {#each sections as section}
            <SectionNavButton
              label={section.label}
              description={section.description}
              active={activeSection === section.key}
              onclick={() => (activeSection = section.key)}
            />
          {/each}
        </nav>

        <div
          class="flex min-h-[34rem] flex-1 flex-col rounded-2xl border border-border bg-card shadow-xl shadow-foreground/5"
        >
          <div
            class="flex items-center justify-between border-b border-border px-6 py-4"
          >
            <div>
              <p class="text-sm font-medium">配置向导</p>
              <p class="text-xs text-muted-foreground">
                {sections[activeIndex].label} / {sections[activeIndex]
                  .description}
              </p>
            </div>
            <div class="text-xs text-muted-foreground">
              {activeIndex + 1} / {sections.length}
            </div>
          </div>

          <ScrollArea class="h-[30rem] w-full flex-1">
            <div class="p-6 md:p-10">
              {#if activeSection === "general"}
                <GeneralPage />
              {/if}
              {#if activeSection === "dish"}
                <DishPage />
              {/if}
            </div>
          </ScrollArea>
        </div>
      </div>

      {#if configErrorMessage}
        <p class="mx-auto mt-4 max-w-5xl text-sm text-destructive md:pl-44">
          {configErrorMessage}
        </p>
      {/if}

      <div class="mx-auto mt-5 flex max-w-5xl justify-between gap-3 md:pl-44">
        <Button
          variant="outline"
          onclick={selectPrevious}
          disabled={isFirstSection}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          上一步
        </Button>
        <Button onclick={selectNextOrSubmit} disabled={isSubmittingConfig}>
          {isLastSection ? "完成" : "下一步"}
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </section>
  </div>
</main>
