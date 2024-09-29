import {inject, Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ImageAuxData} from '@utility/domain/interface/i.seo-social-share';

@Injectable({
  providedIn: 'root',
})
export class TwitterSocialShareSeoService {
  private readonly metaService = inject(Meta);
  private readonly titleService = inject(Title);

  /**
   * This method is used to set the 'title' of the document and various related meta tags in the document's head.
   * It first sets the title of the document using the Title service.
   * If the provided title parameter is truthy and has a length greater than 0, it updates the 'twitter:title', 'twitter:image:alt', 'og:image:alt', 'og:title', 'title', and 'name' meta tags with the provided title.
   * If the provided title parameter is falsy or has a length of 0, it removes the 'twitter:title', 'twitter:image:alt', 'og:image:alt', 'og:title', 'title', and 'name' meta tags from the document's head.
   *
   * @param {string} [title=''] - The title to set in the document and the related meta tags.
   */
  public setTitle(title: string = ''): void {
    this.titleService.setTitle(title);
    if (title && title.length) {
        this.metaService.updateTag({name: 'twitter:title', content: title});
        this.metaService.updateTag({name: 'twitter:image:alt', content: title});
    } else {
      this.metaService.removeTag(`name='twitter:title'`);
      this.metaService.removeTag(`name='twitter:image:alt'`);
    }
  }

  /**
   * This method is used to set the 'description' of the document and various related meta tags in the document's head.
   * If the provided description parameter is truthy and has a length greater than 0, it updates the 'twitter:description', 'og:description', 'description', and 'itemprop:description' meta tags with the provided description.
   * If the provided description parameter is falsy or has a length of 0, it removes the 'twitter:description', 'og:description', 'description', and 'itemprop:description' meta tags from the document's head.
   *
   * @param {string} [description] - The description to set in the document and the related meta tags.
   */
  public setDescription(description?: string): void {
    if (description && description.length) {
      this.metaService.updateTag({
        name: 'twitter:description',
        content: description,
      });
    } else {
      this.metaService.removeTag(`name='twitter:description'`);
    }
  }

  /**
   * This method is used to set the 'image' and related meta tags in the document's head.
   * If the provided image parameter is truthy and has a length greater than 0, it updates the 'twitter:image', 'og:image', and 'itemprop:image' meta tags with the provided image.
   * It also sets additional image related meta tags based on the provided auxData parameter.
   * If the provided image parameter is falsy or has a length of 0, it removes the 'twitter:image', 'og:image', and 'itemprop:image' and related meta tags from the document's head.
   *
   * @param {string} [image] - The image URL to set in the 'twitter:image', 'og:image', and 'itemprop:image' meta tags.
   * @param {ImageAuxData} [auxData] - The auxiliary data for the image, including height, width, alt text, mime type, and secure URL.
   */
  public setImage(image?: string, auxData?: ImageAuxData): void {
    if (image && image.length) {
        this.metaService.updateTag({name: 'twitter:image', content: image});

      if (auxData && auxData.alt) {
        this.metaService.updateTag({
          property: 'twitter:image:alt',
          content: auxData.alt,
        });
      } else {
        this.metaService.removeTag(`property='twitter:image:alt'`);
      }
    } else {
      this.metaService.removeTag(`name='twitter:image'`);
      this.metaService.removeTag(`property='twitter:image:alt'`);
    }
  }

  public setTwitterSiteCreator(site?: string): void {
    if (site) {
        this.metaService.updateTag({name: 'twitter:site', content: site});
        this.metaService.updateTag({name: 'twitter:creator', content: site});
    } else {
      this.metaService.removeTag(`name='twitter:site'`);
      this.metaService.removeTag(`name='twitter:creator'`);
    }
  }

  public setTwitterCard(card?: string): void {
    if (card) {
        this.metaService.updateTag({name: 'twitter:card', content: card});
    } else {
      this.metaService.removeTag(`name='twitter:card'`);
    }
  }
}
