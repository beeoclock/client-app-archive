import {inject, Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';
import {ImageAuxData, ISeoSocialShare, SeoMetaTag,} from '@utility/domain/interface/i.seo-social-share';
import {TwitterSocialShareSeoService} from '@utility/cdk/seo/social-share/twitter.social-share.seo.service';
import {XSocialShareSeoService} from '@utility/cdk/seo/social-share/x.social-share.seo.service';

@Injectable({
  providedIn: 'root',
})
export class SocialShareSeoService {
  private readonly metaService = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly twitterSocialShareSeoService = inject(
    TwitterSocialShareSeoService,
  );
  private readonly xSocialShareSeoService = inject(XSocialShareSeoService);

  /**
   * This method is used to set various metadata for SEO and social share.
   * It takes an object of type ISeoSocialShare as input and sets the metadata accordingly.
   * The metadata includes section, keywords, title, type, description, image, url, published date, modified date, and author.
   *
   * @param {ISeoSocialShare} data - The data to set the metadata.
   */
  public setData(data: ISeoSocialShare): void {
    this.setSection(data.section);
    this.setKeywords(data.keywords);
    this.setTitle(data.title);
    this.setType(data.type);
    this.setDescription(data.description);
    this.setImage(data.image, data.imageAuxData);
    this.setUrl(data.url);
    this.setPublished(data.published);
    this.setModified(data.modified);
    this.setAuthor(data.author);
  }

  /**
   * This method is used to set the 'keywords' meta tag in the document's head.
   * If the provided keywords parameter is truthy, it updates the 'keywords' meta tag with the provided keywords.
   * If the provided keywords parameter is falsy, it removes the 'keywords' meta tag from the document's head.
   *
   * @param {string} [keywords] - The keywords to set in the 'keywords' meta tag.
   */
  public setKeywords(keywords?: string): void {
    if (keywords) {
        this.metaService.updateTag({name: 'keywords', content: keywords});
    } else {
      this.metaService.removeTag(`name='keywords'`);
    }
  }

  /**
   * This method is used to set the 'article:section' meta tag in the document's head.
   * If the provided section parameter is truthy, it updates the 'article:section' meta tag with the provided section.
   * If the provided section parameter is falsy, it removes the 'article:section' meta tag from the document's head.
   *
   * @param {string} [section] - The section to set in the 'article:section' meta tag.
   */
  public setSection(section?: string): void {
    if (section) {
        this.metaService.updateTag({name: 'article:section', content: section});
    } else {
      this.metaService.removeTag(`name='article:section'`);
    }
  }

  /**
   * This method is used to set the 'title' of the document and various related meta tags in the document's head.
   * It first sets the title of the document using the Title service.
   * If the provided title parameter is truthy and has a length greater than 0, it updates the 'og:image:alt', 'og:title', 'title', and 'name' meta tags with the provided title.
   * If the provided title parameter is falsy or has a length of 0, it removes the 'og:image:alt', 'og:title', 'title', and 'name' meta tags from the document's head.
   *
   * @param {string} [title=''] - The title to set in the document and the related meta tags.
   */
  public setTitle(title: string = ''): void {
    this.titleService.setTitle(title);
    this.twitterSocialShareSeoService.setTitle(title);
    this.xSocialShareSeoService.setTitle(title);
    if (title && title.length) {
        this.metaService.updateTag({property: 'og:image:alt', content: title});
        this.metaService.updateTag({property: 'og:title', content: title});
        this.metaService.updateTag({name: 'title', content: title});
      this.metaService.updateTag(
          {itemprop: 'name', content: title},
        `itemprop='name'`,
      );
    } else {
      this.metaService.removeTag(`property='og:image:alt'`);
      this.metaService.removeTag(`property='og:title'`);
      this.metaService.removeTag(`name='title'`);
      this.metaService.removeTag(`itemprop='name'`);
    }
  }

  /**
   * This method is used to set the 'og:type' meta tag in the document's head.
   * If the provided type parameter is truthy and has a length greater than 0, it updates the 'og:type' meta tag with the provided type.
   * If the provided type parameter is falsy or has a length of 0, it removes the 'og:type' meta tag from the document's head.
   *
   * @param {string} [type] - The type to set in the 'og:type' meta tag.
   */
  public setType(type?: string): void {
    if (type && type.length) {
        this.metaService.updateTag({property: 'og:type', content: type});
    } else {
      this.metaService.removeTag(`property='og:type'`);
    }
  }

  /**
   * This method is used to set the 'description' of the document and various related meta tags in the document's head.
   * If the provided description parameter is truthy and has a length greater than 0, it updates the 'og:description', 'description', and 'itemprop:description' meta tags with the provided description.
   * If the provided description parameter is falsy or has a length of 0, it removes the 'og:description', 'description', and 'itemprop:description' meta tags from the document's head.
   *
   * @param {string} [description] - The description to set in the document and the related meta tags.
   */
  public setDescription(description?: string): void {
    this.twitterSocialShareSeoService.setDescription(description);
    this.xSocialShareSeoService.setDescription(description);
    if (description && description.length) {
      this.metaService.updateTag({
        property: 'og:description',
        content: description,
      });
        this.metaService.updateTag({name: 'description', content: description});
      this.metaService.updateTag(
          {itemprop: 'description', content: description},
        `itemprop='description'`,
      );
    } else {
      this.metaService.removeTag(`property='og:description'`);
      this.metaService.removeTag(`name='description'`);
      this.metaService.removeTag(`itemprop='description'`);
    }
  }

  /**
   * This method is used to set the 'image' and related meta tags in the document's head.
   * If the provided image parameter is truthy and has a length greater than 0, it updates the 'og:image', and 'itemprop:image' meta tags with the provided image.
   * It also sets additional image related meta tags based on the provided auxData parameter.
   * If the provided image parameter is falsy or has a length of 0, it removes the 'og:image', and 'itemprop:image' and related meta tags from the document's head.
   *
   * @param {string} [image] - The image URL to set in the 'og:image', and 'itemprop:image' meta tags.
   * @param {ImageAuxData} [auxData] - The auxiliary data for the image, including height, width, alt text, mime type, and secure URL.
   */
  public setImage(image?: string, auxData?: ImageAuxData): void {
    this.twitterSocialShareSeoService.setImage(image, auxData);
    this.xSocialShareSeoService.setImage(image, auxData);
    if (image && image.length) {
      this.metaService.updateTag(
          {itemprop: 'image', content: image},
        `itemprop='image'`,
      );
        this.metaService.updateTag({property: 'og:image', content: image});

      if (auxData && auxData.height) {
        this.metaService.updateTag({
          property: 'og:image:height',
          content: auxData.height.toString(),
        });
      } else {
        this.metaService.removeTag(`property='og:image:height'`);
      }

      if (auxData && auxData.width) {
        this.metaService.updateTag({
          property: 'og:image:width',
          content: auxData.width.toString(),
        });
      } else {
        this.metaService.removeTag(`property='og:image:width'`);
      }

      if (auxData && auxData.alt) {
        this.metaService.updateTag({
          property: 'og:image:alt',
          content: auxData.alt,
        });
      } else {
        this.metaService.removeTag(`property='og:image:alt'`);
      }

      if (auxData && auxData.mimeType) {
        this.metaService.updateTag({
          property: 'og:image:type',
          content: auxData.mimeType,
        });
      } else {
        this.metaService.removeTag(`property='og:image:type'`);
      }

      if (auxData && auxData.secureUrl) {
        this.metaService.updateTag({
          property: 'og:image:secure_url',
          content: auxData.secureUrl,
        });
      } else {
        this.metaService.removeTag(`property='og:image:secure_url'`);
      }
    } else {
      this.metaService.removeTag(`property='og:image'`);
      this.metaService.removeTag(`property='og:image:height'`);
      this.metaService.removeTag(`property='og:image:secure_url'`);
      this.metaService.removeTag(`property='og:image:type'`);
      this.metaService.removeTag(`property='og:image:alt'`);
      this.metaService.removeTag(`property='og:image:width'`);
      this.metaService.removeTag(`itemprop='image'`);
    }
  }

  /**
   * This method is used to set the 'og:url' meta tag in the document's head and the canonical URL.
   * If the provided url parameter is truthy and has a length greater than 0, it updates the 'og:url' meta tag with the provided url and sets the canonical URL.
   * If the provided url parameter is falsy or has a length of 0, it removes the 'og:url' meta tag from the document's head and removes the canonical URL.
   *
   * @param {string} [url] - The url to set in the 'og:url' meta tag and as the canonical URL.
   */
  public setUrl(url?: string): void {
    if (url && url.length) {
        this.metaService.updateTag({property: 'og:url', content: url});
    } else {
      this.metaService.removeTag(`property='og:url'`);
    }
    this.setCanonicalUrl(url);
  }

  public setPublished(publishedDateString?: string): void {
    if (publishedDateString) {
      const publishedDate = new Date(publishedDateString);
      this.metaService.updateTag({
        name: 'article:published_time',
        content: publishedDate.toISOString(),
      });
      this.metaService.updateTag({
        name: 'published_date',
        content: publishedDate.toISOString(),
      });
    } else {
      this.metaService.removeTag(`name='article:published_time'`);
      this.metaService.removeTag(`name='publication_date'`);
    }
  }

  public setModified(modifiedDateString?: string): void {
    if (modifiedDateString) {
      const modifiedDate = new Date(modifiedDateString);
      this.metaService.updateTag({
        name: 'article:modified_time',
        content: modifiedDate.toISOString(),
      });
      this.metaService.updateTag({
        name: 'og:updated_time',
        content: modifiedDate.toISOString(),
      });
    } else {
      this.metaService.removeTag(`name='article:modified_time'`);
      this.metaService.removeTag(`name='og:updated_time'`);
    }
  }

  public setLocale(locale?: string): void {
    if (locale) {
        this.metaService.updateTag({property: 'og:locale', content: locale});
      this.setLanguage(locale);
      // Update lang attribute on html element
      this.document.documentElement.lang = locale;
    } else {
      this.metaService.removeTag(`property='og:locale'`);
    }
  }

  public setLocaleAlternate(locales?: string[]): void {
    if (locales && locales.length) {
      for (const locale of locales) {
        this.metaService.updateTag({
          property: 'og:locale:alternate',
          content: locale,
        });
      }
    } else {
      this.metaService.removeTag(`property='og:locale:alternate'`);
    }
  }

  public setAuthor(author?: string): void {
    if (author && author.length) {
        this.metaService.updateTag({name: 'article:author', content: author});
        this.metaService.updateTag({name: 'author', content: author});
    } else {
      this.metaService.removeTag(`name='article:author'`);
      this.metaService.removeTag(`name='author'`);
    }
  }

  public setSiteCreator(site?: string): void {
    this.twitterSocialShareSeoService.setTwitterSiteCreator(site);
    this.xSocialShareSeoService.setXSiteCreator(site);
  }

  public setCard(
    card?: 'summary' | 'summary_large_image' | 'app' | 'player',
  ): void {
    this.twitterSocialShareSeoService.setTwitterCard(card);
    this.xSocialShareSeoService.setXCard(card);
  }

  public setFbAppId(appId?: string): void {
    if (appId) {
        this.metaService.updateTag({property: 'fb:app_id', content: appId});
    } else {
      this.metaService.removeTag(`property='fb:app_id'`);
    }
  }

  public setMetaTag(metaTag: SeoMetaTag): void {
    if (metaTag.value) {
      const metaTagObject = {
        [metaTag.attr]: metaTag.attrValue,
        content: metaTag.value,
      };
      this.metaService.updateTag(metaTagObject);
    } else {
      const selector = `${metaTag.attr}='${metaTag.attrValue}'`;
      this.metaService.removeTag(selector);
    }
  }

  public setMetaTags(metaTags: SeoMetaTag[]): void {
    for (const metaTag of metaTags) {
      this.setMetaTag(metaTag);
    }
  }

  public setSubTitle(subTitle: string): void {
      this.metaService.updateTag({name: 'subtitle', content: subTitle});
  }

  public setLanguage(language: string): void {
      this.metaService.updateTag({name: 'language', content: language});
  }

  public setLanguageAlternativeUrl(lang: string, url?: string): void {
    // first remove potential previous url
    const selector = `link[rel='alternate'][hreflang='${lang}']`;
    const languageAlternativeElement =
      this.document.head.querySelector(selector);
    if (languageAlternativeElement) {
      this.document.head.removeChild(languageAlternativeElement);
    }

    if (url && url.length) {
      const link: HTMLLinkElement = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', url);
      this.document.head.appendChild(link);
    }
  }

  public setCanonicalUrl(url?: string): void {
    // first remove potential previous url
    const selector = `link[rel='canonical']`;
    const canonicalElement = this.document.head.querySelector(selector);
    if (canonicalElement) {
      this.document.head.removeChild(canonicalElement);
    }

    if (url && url.length) {
      const link: HTMLLinkElement = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      this.document.head.appendChild(link);
    }
  }

  /**
   * <meta name='og:latitude' content='37.416343'>
   * <meta name='og:longitude' content='-122.153013'>
   * <meta name='og:street-address' content='1601 S California Ave'>
   * <meta name='og:locality' content='Palo Alto'>
   * <meta name='og:region' content='CA'>
   * <meta name='og:postal-code' content='94304'>
   * <meta name='og:country-name' content='USA'>
   */

  public setStreetAddress(streetAddress: string): void {
    this.metaService.updateTag({
      name: 'og:street-address',
      content: streetAddress,
    });
  }

  public setLocality(locality: string): void {
      this.metaService.updateTag({name: 'og:locality', content: locality});
  }

  public setRegion(region: string): void {
      this.metaService.updateTag({name: 'og:region', content: region});
  }

  public setPostalCode(postalCode: string): void {
      this.metaService.updateTag({name: 'og:postal-code', content: postalCode});
  }

  public setCountryName(countryName: string): void {
    this.metaService.updateTag({
      name: 'og:country-name',
      content: countryName,
    });
  }
}
