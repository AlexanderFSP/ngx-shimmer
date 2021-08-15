import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface INgxShimmerComponentState {
  isLoading: boolean;
  src?: string;
  isFailure?: boolean;
}

class IntendedError extends Error {
  public readonly intention: string = 'forcePromiseReject';
}

/**
 * TODO:
 * - Setup linter (eslint)
 * - Tpl & styles
 * - Control shimmer & image proportions (via inputs or via css variables)
 * - Custom error template (via projection)
 * - Extended logging for 'development' mode
 * - Tests
 * - README.md
 * - Publish
 */
@Component({
  selector: 'ngx-shimmer',
  templateUrl: './ngx-shimmer.component.html',
  styleUrls: ['./ngx-shimmer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxShimmerComponent implements OnChanges, OnDestroy {
  @Input() public src!: string;
  @Input() public alt: string = '';

  @Output() public readonly onLoad = new EventEmitter<HTMLImageElement>();

  public readonly state$: Observable<INgxShimmerComponentState>;

  private img?: HTMLImageElement;
  private forceReject?: (reason: IntendedError) => void;

  private readonly _state$ = new BehaviorSubject<INgxShimmerComponentState>({ isLoading: false });

  constructor() {
    this.state$ = this._state$.asObservable();
  }

  public ngOnChanges({ src }: SimpleChanges): void {
    if (src && src.currentValue !== src.previousValue) {
      // Reset state
      this._state$.next({ isLoading: false });

      this.start();
    }
  }

  public ngOnDestroy(): void {
    this.forceReject = undefined;
    this.img = undefined;
  }

  /**
   * Start image loading process
   */
  private async start(): Promise<void> {
    // Validate `src` input existence
    if (!this.src) {
      this._state$.next({ isLoading: false, isFailure: true });

      return;
    }

    this._state$.next({ isLoading: true });

    try {
      const src = await this.loadImage(this.src);

      this._state$.next({ isLoading: false, src });
    } catch (error) {
      // If this is an intended/forced rejection, don't make it visible to user
      if (!(error instanceof IntendedError)) {
        this._state$.next({ isLoading: false, isFailure: true });
      }
    }
  }

  /**
   * Preload & predecode image programmatically
   * @param {number} src URL of an image
   * @returns Promise which resolves `src` when image is ready for rendering
   */
  private async loadImage(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.img) {
        this.img.onload = null;
        this.img.onerror = null;
        // Previous promise call must be cancelled for decode()
        this.forceReject?.(new IntendedError());
      }

      const img = new Image();

      this.img = img;
      this.forceReject = reject;

      const onResolve = async () => {
        if (img.decode !== undefined) {
          try {
            await img.decode();
          } catch {}
        }

        resolve(img.src);

        this.onLoad.emit(img);
      };

      const onReject = () => reject(new Error('An error occurred while trying to download an image'));

      img.onload = onResolve;
      img.onerror = onReject;
      img.src = src;
    });
  }
}
