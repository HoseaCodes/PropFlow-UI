import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface EstimateData {
  nights: number;
  nightlyRate: number;
  totalEstimate: number;
}
@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) {}

  estimate: EstimateData = {
    nights: 7,
    nightlyRate: 188,
    totalEstimate: 1316
  };

  hosts = [
    {
      name: 'Nani',
      location: 'Dallas, TX',
      role: 'Resident & Host',
      image: 'https://a0.muscache.com/im/pictures/mediaverse/A4RE-PLP/original/88139d34-f308-43fc-908f-a07b893d794b.jpeg'
    },
    {
      name: 'Jeff and Amador',
      location: 'San Diego, CA',
      role: 'Residents & Hosts',
      image: 'https://a0.muscache.com/im/pictures/mediaverse/A4RE-PLP/original/46faca6b-df8a-4b76-9d45-d8bac7151141.jpeg'
    },
    {
      name: 'Buddy',
      location: 'Denver, CO',
      role: 'Resident & Host',
      image: 'https://a0.muscache.com/im/pictures/mediaverse/A4RE-PLP/original/2dbad1eb-dc50-4ed4-b796-ebcf2b236139.jpeg'
    }
  ];

  faqItems = [
    {
      question: 'Is my place right for Airbnb?',
      answer: 'Airbnb guests are interested in all kinds of places. We have listings for tiny homes, cabins, treehouses, and more. Even a spare room can be a great place to stay.',
      isOpen: false
    },
    {
      question: 'Do I have to host all the time?',
      answer: 'Not at all—you control your calendar. You can host once a year, a few nights a month, or more often.',
      isOpen: false
    },
    {
      question: 'How much should I interact with guests?',
      answer: "It's up to you. Some Hosts prefer to message guests only at key moments—like sending a short note when they check in—while others also enjoy meeting their guests in person. You'll find a style that works for you and your guests.",
      isOpen: false
    }
  ];

  selectedNights: string = '7';

  ngOnInit(): void {}

  updateNights(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedNights = input.value;
    this.estimate.nights = parseInt(input.value);
    this.calculateEstimate();
  }

  toggleFaq(index: number): void {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }

  private calculateEstimate(): void {
    this.estimate.totalEstimate = this.estimate.nights * this.estimate.nightlyRate;
  }

  navigateToSignUp() {
    this.router.navigateByUrl('/signup');
  }
}
