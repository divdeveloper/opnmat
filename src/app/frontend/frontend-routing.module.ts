import {
  RouterModule,
  Routes,
  CanActivate,
} from '@angular/router';
import {
  NgModule,
} from '@angular/core';

import {
  AuthGuardService as AuthGuard,
} from '../services/auth/auth-guard.service';

import {
  AcademyGuardService as AcademyGuard,
} from '../services/auth/academy-guard.service';
import {
  AcademyProService as AcademyPro,
} from '../services/auth/academy-pro.service';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: 'app/frontend/auth/auth.module#AuthModule',
  },
  {
    path: '',
    loadChildren: 'app/frontend/pages/feed-page/feed-page.module#FeedPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/:id',
    loadChildren: 'app/frontend/pages/profile-page/profile-page.module#ProfilePageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/:id/followers',
    loadChildren: 'app/frontend/pages/followers/followers-page.module#FollowersPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/:id/followings',
    loadChildren: 'app/frontend/pages/followings/followings-page.module#FollowingsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'academies',
    loadChildren: 'app/frontend/pages/academies/academy-page.module#AcademyPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'academiy-datail/:id',
    loadChildren: 'app/frontend/pages/academy-detail/academy-detail.module#AcademyDetailPageModule',
    canActivate: [AuthGuard],
  },  {
    path: 'academiy-datail/:id/messages',
    loadChildren: 'app/frontend/pages/academy-messages/academy-messages.module#AcademyMessagesModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'academiy-datail/:id/settings',
    loadChildren: 'app/frontend/pages/settings/settings-page.module#SettingsPageModule',
    canActivate: [AuthGuard, AcademyGuard],
  },
  {
    path: 'academiy-datail/:id/create-subscriptions',
    loadChildren: 'app/frontend/pages/create-subscriptions/create-subscriptions.module#CreateSubscriptionsPageModule',
    canActivate: [AuthGuard, AcademyPro, AcademyGuard],
  },
  {
    path: 'academiy-datail/:id/teachers-techniques',
    loadChildren: 'app/frontend/pages/teachers-techniques/teachers-techniques.module#TeachersTechniquesPageModule',
    canActivate: [AuthGuard, AcademyPro, AcademyGuard],
  },
  {
    path: 'academiy-datail/:id/classes',
    loadChildren: 'app/frontend/pages/classes/classes-page.module#ClassesPageModule',
    canActivate: [AuthGuard, AcademyPro, AcademyGuard],
  },  {
    path: 'academiy-datail/:id/activities',
    loadChildren: 'app/frontend/pages/activities/activities-page.module#ActivitiesPageModule',
    canActivate: [AuthGuard, AcademyPro, AcademyGuard],
  },
  {
    path: 'academiy-datail/:id/students',
    loadChildren: 'app/frontend/pages/students/students.module#StudentsModule',
    canActivate: [AuthGuard, AcademyGuard],
  },
  {
    path: 'academiy-datail/:id/contacts',
    loadChildren: 'app/frontend/pages/contacts/contacts-page.module#ContactsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'activity/:id',
    loadChildren: 'app/frontend/pages/activity-view/activity-view.module#ActivityViewPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'message',
    loadChildren: 'app/frontend/pages/message/message-page.module#MessagePageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'notification',
    loadChildren: 'app/frontend/pages/notification/notification-page.module#NotificationPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'my-technique-roadmap',
    loadChildren: 'app/frontend/pages/roadmap/roadmap-page.module#RoadmapPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'events-near-me',
    loadChildren: 'app/frontend/pages/events/events-page.module#EventsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'check-in',
    loadChildren: 'app/frontend/pages/checkin/checkin-page.module#CheckinPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'subscriptions',
    loadChildren: 'app/frontend/pages/subscriptions/subscriptions-page.module#SubscriptionsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'search',
    loadChildren: 'app/frontend/pages/search/search-page.module#SearchPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'redirect',
    loadChildren: 'app/frontend/helpers/redirect/redirect.module#RedirectModule',
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontendRoutingModule {}
