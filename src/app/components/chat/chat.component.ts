import { Component, OnDestroy, OnInit } from '@angular/core';
import { SupaService } from '../../services/supa.service';
import { SigninService } from '../../services/signin.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RealtimeChannel, User } from '@supabase/supabase-js';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chat',
  imports:
  [
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})

export class ChatComponent implements OnInit, OnDestroy
{
  allMessages: any[] | null = [];
  newMessage: string = "";
  isSigned: boolean = false;
  signedsubscription?: Subscription;
  channel?: RealtimeChannel;

  constructor(private supabaseService: SupaService, protected signed: SigninService){}

  ngOnInit(): void
  {
    this.getAllMessages();
    this.getUser();

    this.channel = this.supabaseService.supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
      },
      () => {this.getAllMessages()}
    )
    .subscribe()
  }

  ngOnDestroy(): void
  {
    this.signedsubscription?.unsubscribe();
    this.channel?.unsubscribe()
  }


  private async getAllMessages()
  {
    this.allMessages = (await this.supabaseService.supabase.from("messages")
    .select(`
      *,
      users ( nickname, uid )
      `)
      .eq("chat_id", 1)
      .order('created_at',  { ascending: false }) ).data;
  }

  protected async sendMessage()
  {
    if (this.newMessage != "")
    {
      const {data,  error } = await this.supabaseService.supabase.from('messages').insert
      ({
        chat_id: 1,
        author: this.signed.user?.id,
        content: this.newMessage,
      })
  
      this.newMessage = "";
    }
  }

  protected formatDate(date: string) : string
  {
    let formatedDate = new Date(Date.parse(date));
    return formatedDate.toLocaleString();
  }

  protected capitalizeNickname(nickname: string) : string
  {
    return nickname![0].toUpperCase() + nickname!.slice(1);
  }

  public getUser()
  {
    this.signedsubscription = this.signed.emitter
    .subscribe(
    {
      next: (data: User) =>
      {
        if (data != undefined)
        {
          this.isSigned = true;
        } else {
          this.isSigned = false;
        }
      }
    })
  }

}

