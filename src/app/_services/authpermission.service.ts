import { Injectable } from '@angular/core';

    @Injectable()
    export class AppPermissionService {

        constructor () { }

        public role: any;
        public permissions: any = [
            {
                "Description":"ScentPortfolioDashboardMgr",
                "ID":1523,
                "EntityID":1354,
                "EntityValue":null,
                "AccessRoleID":1014,
                "ReadFlag":false,
                "WriteFlag":true,
                "DeleteFlag":false,
                "HiddenFlag":false,
                "ActiveFlag":true,
                "PicklistValue":"ScentPortfolioDashboard",
                "DisplayLabel":"ScentPortfolio Dashboard",
                "ToolTipText":null,
                "PlaceHolderText":null
             },
             {
                "Description":"ScentPortfolioDashboardMgr",
                "ID":1524,
                "EntityID":1355,
                "EntityValue":null,
                "AccessRoleID":1014,
                "ReadFlag":false,
                "WriteFlag":true,
                "DeleteFlag":false,
                "HiddenFlag":false,
                "ActiveFlag":true,
                "PicklistValue":"ScentPortfolioAll",
                "DisplayLabel":"ScentPortfolio All",
                "ToolTipText":null,
                "PlaceHolderText":null
             }
        ];
        public callbacks: any = [];
        public dashboardPermission: any[];

        public getPermissions() {
            return this.permissions;
        }

        public getPermission(entity) {
            return this.permissions.filter(items => items.PicklistValue === entity)[0];
        }

        public getDashboardPermission(entity) {
            console.log('DASHBOARD ALL => ', this.permissions.filter(items => items.PicklistValue === entity)[0]);
            return this.permissions.filter(items => items.PicklistValue === entity)[0];
        }

        public setPermissions(perm) {
            this.permissions = perm;
            if (this.callbacks.length) {
                for (let j = 0; j < this.callbacks.length; j++) {
                    this.callbacks[j].fn();
                }
            }
            this.callbacks = [];
        }

        public getRole () {
            return this.role;
        }

        public setRole (role) {
            this.role = role;
        }

        public addQueue(cb) {
            this.callbacks.push({fn: cb});
        }

    }
