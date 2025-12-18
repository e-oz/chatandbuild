import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AppStore } from '../stores/app.store';
import { MessagesStore } from '../stores/messages.store';
// Optional: You can use the MessageService from services/message.service.ts instead of HttpClient directly
// import { MessageService, Message } from '../services/message.service';
// import { WorkspaceService, Workspace } from '../services/workspace.service';

// ⚠️ CRITICAL WARNING: DO NOT USE AI TOOLS
// This assessment must be completed WITHOUT using AI tools such as Cursor, ChatGPT, 
// GitHub Copilot, or any other AI coding assistants.
// If you use AI tools to complete this assessment, you will FAIL.

// TODO: Task 1 - Implement this component
// Requirements:
// 1. Fetch workspace messages from the API endpoint: GET /api/workspaces/:workspaceId/messages
//    - You can use a hardcoded workspace ID (e.g., get the first workspace from /api/workspaces)
// 2. Display messages in a simple list format
// 3. Each message should show:
//    - Message content
//    - Author name
//    - Timestamp (formatted date/time)
//    - Message type (text, file, system)
// 4. Add loading state while fetching data
// 5. Handle error states (show error message if API call fails)
// 6. Add basic styling to make it look clean and readable
//
// Note: MessageService and WorkspaceService are available in services/ if you prefer to use them

@Component({
  selector: 'app-task1',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task1.component.html',
  imports: [
    DatePipe
  ],
  host: {
    class: 'flex flex-col gap-4 w-full',
  }
})
export class Task1Component {
  // TODO: Pagination
  // - currentPage: number = 1;
  // - hasMore: boolean = true;

  private readonly messagesStore = inject(MessagesStore);
  private readonly appStore = inject(AppStore);

  protected readonly isLoading = computed(() => {
    return this.appStore.isLoadingInitialWorkspace() || this.messagesStore.collection.$isReading();
  });

  protected readonly messages = this.messagesStore.collection.$items;
  protected readonly lastError = this.messagesStore.collection.$lastReadError;
}
