<script>
  /**
   * @type {AvatarShape}
   */
  export let type;
  /**
   * @type {string}
   */
  export let url;
  /**
   * @type {string}
   */
  export let handle;
  /**
   * @type {boolean?}
   */
  export let hideOnMobile;
  /**
   * @type {boolean?}
   */
  export let tiny;

  /**
   * @param {AvatarShape} avatarShape
   */
  function avatarMaskClass(avatarShape) {
    switch (avatarShape) {
      case 'capsule-big':
        return 'mask-capsule-big';
      case 'capsule-small':
        return 'mask-capsule-small';
      case 'roundrect':
        return 'mask-roundrect';
      case 'squircle':
        return 'mask-squircle';
      case 'egg':
        return 'mask-egg';
      default:
      case 'circle':
        return 'mask-circle';
    }
  }

  const avatarURL = `${url}?width=80&height=80&fit=cover&dpr=2&auto=webp`;
  const noTransparentAvatar = false;
  const maskName = avatarMaskClass(type);
</script>

<style lang="scss">
  .profile-picture {
    display: block;
    flex: 0 0 auto;
    position: relative;
    aspect-ratio: 1 / 1;
    width: 4rem;
    height: 4rem;
    &.tiny {
      width: 2rem;
      height: 2rem;
    }

    &.hide-on-mobile {
      display: none;
      @media (min-width: 1024px) {
        display: block;
      }
    }
    &.show-on-mobile {
      display: block;
      @media (min-width: 1024px) {
        display: none;
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;

      &.no-transparent-avatar {
        background-image: var(--avatar);
      }

      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;

      &.mask-squircle {
        mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDBDMjAgMCAwIDIwIDAgMTAwczIwIDEwMCAxMDAgMTAwIDEwMC0yMCAxMDAtMTAwUzE4MCAwIDEwMCAweiIvPjwvc3ZnPg==);
      }

      &.mask-roundrect {
        //@apply rounded-lg;
        border-radius: 0.5rem;
      }

      &.mask-circle {
        //@apply rounded-full;
        border-radius: 9999px;
      }

      &.mask-egg {
        mask-image: url('/masks/egg.svg');
      }

      &.mask-capsule-big {
        mask-image: url('/masks/capsule-big.svg');
      }

      &.mask-capsule-small {
        mask-image: url('/masks/capsule-small.svg');
      }
    }
  }
</style>

<a 
  href="https://cohost.org/{handle}"
  class="profile-picture"
  class:hide-on-mobile={hideOnMobile === true}
  class:show-on-mobile={hideOnMobile === false}
  class:tiny={tiny}
  title="@{handle}"
>
  <img
    class={maskName}
    class:no-transparent-avatar={noTransparentAvatar}
    style="--avatar:url('{avatarURL}')"
    src={avatarURL}
    alt={handle}
  />
</a>