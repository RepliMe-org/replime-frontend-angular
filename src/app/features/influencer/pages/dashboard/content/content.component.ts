import { Component, OnInit, OnDestroy, DestroyRef, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';
import { finalize, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AddSourceMode, AddSourcePayload, VideoResponseDTO } from '../../../models/training-source.model';
import { TrainingSourceService } from '../../../services/training-source.service';
import { SyncStatusWsService } from '../../../../../core/websocket/domains/sync-status-ws.service';
import { InfluencerChatbotService } from '../../../services/influencer-chatbot.service';
import { AddSourceModalComponent } from './components/add-source-modal/add-source-modal.component';
import { ThumbnailCellRendererComponent } from './components/cell-renderers/thumbnail-cell-renderer/thumbnail-cell-renderer.component';
import { VideoDetailsCellRendererComponent } from './components/cell-renderers/video-details-cell-render/video-details-cell-render.component';
import { StatusCellRendererComponent } from './components/cell-renderers/status-cell-renderer/status-cell-renderer.component';
import { ActionCellRendererComponent } from './components/cell-renderers/action-cell-renderer/action-cell-renderer.component';
import { WsSyncMessage } from '../../../../../core/websocket/websocket.model';
import { SharedModule } from '../../../../../shared/shared.module';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [SharedModule, AgGridAngular, AddSourceModalComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent implements OnInit, OnDestroy {
  showModal = false;
  isSubmitting = false;
  modalMode: AddSourceMode = 'VIDEO';

  gridApi!: GridApi;
  rowData: VideoResponseDTO[] = [];
  gridContext: any;

  columnDefs: ColDef[] = [
    {
      headerName: 'Thumbnail',
      field: 'thumbnail',
      width: 120,
      cellRenderer: ThumbnailCellRendererComponent,
      sortable: false,
      resizable: false,
    },
    {
      headerName: 'Details',
      field: 'title',
      flex: 1,
      cellRenderer: VideoDetailsCellRendererComponent,
      sortable: false,
    },
    {
      headerName: 'Status',
      field: 'syncStatus',
      width: 160,
      cellRenderer: StatusCellRendererComponent,
      sortable: true,
      resizable: false,
    },
    {
      headerName: '',
      field: 'videoId',
      width: 120,
      cellRenderer: ActionCellRendererComponent,
      sortable: false,
      resizable: false,
    },
  ];

  private destroyRef = inject(DestroyRef);

  constructor(
    private trainingSourceService: TrainingSourceService,
    private chatbotService: InfluencerChatbotService,
    private syncStatusWs: SyncStatusWsService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.gridContext = { onDeleteVideo: this.deleteVideo.bind(this) };

    this.chatbotService
      .getChatbotConfig()
      .pipe(
        switchMap((chatbot: any) => {
          const chatbotId = chatbot?.chatbotInfo?.id;

          if (!chatbotId) {
            console.error('[WS] No chatbotId found — skipping WebSocket');
            return this.trainingSourceService.getAllVideos();
          }

          this.syncStatusWs
            .connect(chatbotId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((msg: WsSyncMessage) => {
              if (msg.type === 'VIDEO_UPDATE' && msg.videoId != null) {
                this.updateRowStatus(msg.videoId, msg.status);
              }
            });

          return this.trainingSourceService.getAllVideos();
        }),
      )
      .subscribe((videos) => {
        this.rowData = videos;
      });
  }

  updateRowStatus(videoId: number, status: string) {
    const rowIndex = this.rowData.findIndex((r) => r.videoId === videoId);
    if (rowIndex === -1) return;

    this.rowData[rowIndex] = {
      ...this.rowData[rowIndex],
      syncStatus: status as VideoResponseDTO['syncStatus'],
    };

    this.gridApi?.getRowNode(String(rowIndex))?.setData(this.rowData[rowIndex]);
  }

  getAllVideos() {
    this.trainingSourceService.getAllVideos().subscribe((res) => {
      this.rowData = res;
    });
  }

  deleteVideo(videoId: string) {
    this.trainingSourceService
      .deleteVideo(videoId)
      .pipe(finalize(() => this.getAllVideos()))
      .subscribe({
        next: () => this.toast.success('Video removed successfully.'),
        error: () => this.toast.error('Failed to delete video. Please try again.'),
      });
  }

  openModal(mode: AddSourceMode) {
    this.modalMode = mode;
    this.showModal = true;
  }

  onGridReady(params) {
    this.gridApi = params;
  }

  onSubmit(event: AddSourcePayload) {
    this.isSubmitting = true;

    this.trainingSourceService
      .addSource(event)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        }),
      )
      .subscribe({
        next: () => {
          this.toast.success('Source added successfully.');
          this.showModal = false;
          this.getAllVideos();
        },
        error: (err) => {
          this.toast.error( err?.error?.message || 'Failed to add source. Please try again.');
        },
      });
  }

  ngOnDestroy() {
    this.syncStatusWs.disconnect();
  }
}
