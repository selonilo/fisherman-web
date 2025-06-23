import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notifications/notificationswidget';
import { StatsWidget } from './components/statswidget/statswidget';
import { MyPosts } from './components/my-posts/my-posts';
import { RateByPosttype } from './components/rate-by-posttype/rate-by-posttype';
import { RevenueStreamWidget } from './components/revenuestreamwidget';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, MyPosts, RateByPosttype, RevenueStreamWidget, NotificationsWidget],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" />
            <div class="col-span-12 xl:col-span-6">
                <app-my-posts />
                <!-- <app-rate-by-posttype /> -->
            </div>
            <div class="col-span-12 xl:col-span-6">
                <!-- <app-revenue-stream-widget /> -->
                <app-notifications-widget />
            </div>
        </div>
    `
})
export class Dashboard {}
