import { ChangeDetectionStrategy, Component, inject, linkedSignal, signal, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppStore } from '../stores/app.store';
import { MessagesStore } from '../stores/messages.store';
import { WorkspacesStore } from '../stores/workspaces.store';
import type { Workspace } from '../types/workspace';
// Optional: You can use the WorkspaceService and MessageService from services/ instead of HttpClient directly
// import { WorkspaceService, Workspace, CreateWorkspaceRequest } from '../services/workspace.service';
// import { MessageService, SendMessageRequest } from '../services/message.service';

// ⚠️ CRITICAL WARNING: DO NOT USE AI TOOLS
// This assessment must be completed WITHOUT using AI tools such as Cursor, ChatGPT, 
// GitHub Copilot, or any other AI coding assistants.
// If you use AI tools to complete this assessment, you will FAIL.

// TODO: Task 2 - Implement this component
// Requirements:
// 1. Create a form with the following fields:
//    - Workspace Name (text input, required)
//    - Workspace Description (textarea, optional)
//    - Workspace Type (select: public/private, default: public)
// 2. Validate the workspace name field (required)
// 3. On form submit, send POST request to /api/workspaces
// 4. After successful workspace creation, show a message input form:
//    - Message Content (textarea, required)
//    - Message Type (select: text/file/system, default: text)
// 5. Send POST request to /api/workspaces/:id/messages when sending a message
// 6. Display success/error messages for both operations
// 7. Show loading state during API calls
// 8. Reset form after successful submission
//
// Note: WorkspaceService and MessageService are available in services/ if you prefer to use them

@Component({
  selector: 'app-task2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './task2.template.html',
  host: {
    class: 'flex flex-col gap-4 lg:gap-6 w-full',
  },
})
export class Task2Component {
  private readonly workspacesStore = inject(WorkspacesStore);
  private readonly messagesStore = inject(MessagesStore);
  private readonly appStore = inject(AppStore);
  protected readonly workspace = linkedSignal<Workspace | undefined>(() => {
    return this.appStore.currentWorkspace();
  });
  protected readonly errors = signal<string[]>([]);
  protected readonly successMessage = signal<{ message: string; id: string } | undefined>(undefined);
  protected readonly isCreatingWorkspace = this.workspacesStore.isCreating;
  protected readonly isAddingMessage = this.messagesStore.collection.$isCreating;

  protected readonly workspaceForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    type: new FormControl<'public' | 'private' | undefined>('public', { nonNullable: true }),
  });

  protected readonly messageForm = new FormGroup({
    content: new FormControl('', Validators.required),
    type: new FormControl<'text' | 'file' | 'system'>('text', { nonNullable: true }),
    authorName: new FormControl<string | undefined>(undefined),
  });

  protected newWorkspaceForm() {
    this.workspace.set(undefined);
    this.workspaceForm.reset();
    this.messageForm.reset();
    this.resetErrors();
  }

  protected createWorkspace() {
    this.resetErrors();
    const formValue = this.workspaceForm.value;
    if (!formValue.name) {
      this.addError('Workspace name is required');
      return;
    }

    if (!this.workspaceForm.valid) {
      this.addError('Please check the workspace form - some fields have invalid values');
      return;
    }

    this.workspacesStore.createWorkspace({
      name: formValue.name,
      description: formValue.description || undefined,
      type: formValue.type || undefined
    }, {
      onError: () => this.addError('Something went wrong - workspace could not be created'),
      next: (workspace) => {
        if (workspace) {
          this.workspace.set(workspace as Workspace);
        }
        this.showSuccessMessage('Workspace created successfully');
      }
    });
  }

  protected sendMessage() {
    this.resetErrors();

    const workspace = this.workspace();
    if (!workspace) {
      this.addError('Please create a workspace first');
      return;
    }

    const formValue = this.messageForm.value;
    if (!formValue.content) {
      this.addError('Message text is required');
      return;
    }
    if (!formValue.authorName) {
      this.addError('Author name is required');
      return;
    }

    if (!this.messageForm.valid) {
      this.addError('Please check the message form - some fields have invalid values');
      return;
    }

    this.messagesStore.addMessage({
      workspaceId: workspace._id,
      request: {
        content: formValue.content,
        type: formValue.type || 'text',
        author: {
          name: formValue.authorName,
        }
      }
    }, {
      next: () => {
        this.messageForm.reset();
        this.showSuccessMessage('Message sent successfully.');
      },
      onError: (e) => {
        console.error(e)
        this.addError('Something went wrong - message could not be sent');
      },
    });
  }

  private addError(error: string) {
    this.errors.update((errors) => ([...errors, error]));
  }

  private resetErrors() {
    this.errors.set([]);
  }

  private showSuccessMessage(message: string) {
    const id = Math.ceil(Math.random() * 100000000).toString();
    this.successMessage.set({
      id, message
    });
    setTimeout(() => {
      const currentMessage = untracked(this.successMessage);
      if (currentMessage?.id === id) {
        this.successMessage.set(undefined);
      }
    }, 3000);
  }
}
