import { Component, OnInit, OnChanges, OnDestroy, Input, SimpleChanges } from '@angular/core';

import { IntendedError } from './models';

@Component({
  selector: 'ngx-shimmer',
  templateUrl: './ngx-shimmer.component.html',
  styleUrls: ['./ngx-shimmer.component.scss'],
  preserveWhitespaces: true,
})
export class NgxShimmerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() src: string;
  @Input() width = 200;
  @Input() height = 200;
  @Input() delay: number;

  isLoading = false;
  uri = '';
  error = '';

  private timerId: number;
  private img: HTMLImageElement;
  private forceReject: (reason?: any) => void;

  ngOnInit() {
    this.startImageLoadingProcess();
  }

  ngOnChanges({ src }: SimpleChanges) {
    if (src && src.currentValue !== src.previousValue) {
      this.safeClearTimeout();
      this.startImageLoadingProcess();
    }
  }

  ngOnDestroy() {
    // The component might be cancelled(unmounted) before the 'delay' timeout finishes.
    this.safeClearTimeout();
    this.forceReject = null;
    this.img = null;
  }

  private async startImageLoadingProcess() {
    /**
     * To avoid instant loading 'flash' while downloading images with high-speed internet connection
     * (or downloading smaller images that do not cause much loading-time),
     * user may want to give delay before starting to show the shimmer loading indicator.
     * However, given delay should be not more than 1 second. If it is just ignore it.
     */
    if (this.delay && this.delay > 0 && this.delay <= 1000) {
      this.timerId = window.setTimeout(() => {
        this.timerId = null;
        if (!this.src) {
          this.isLoading = true;
        }
      }, this.delay);
    } else {
      this.isLoading = true;
    }

    try {
      const uri = await this.loadImage(this.src);
      this.uri = uri;
      this.isLoading = false;
    } catch (error) {
      // If this is a intended(forced) rejection, don't make it visible to user.
      if (!(error instanceof IntendedError)) {
        this.error = error;
        this.isLoading = false;
      }
    }
  }

  private loadImage(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      if (this.img) {
        this.img.onload = null;
        this.img.onerror = null;
        // Previous promise call must be cancelled for decode().
        this.forceReject && this.forceReject(new IntendedError());
      }
      this.img = img;
      img.src = src;
      this.forceReject = reject;

      if (img.decode !== undefined) {
        img
          .decode()
          .then(() => resolve(img.src))
          .catch(() => reject(new Error('An Error occurred while trying to decode an image')));
      } else {
        img.onload = () => resolve(img.src);
      }

      img.onerror = () => reject(new Error('An Error occurred while trying to download an image'));
    });
  }

  private safeClearTimeout() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
