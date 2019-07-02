import { AppEnvironment } from './config/app.environment';
import { Config, DevConfig, QasConfig, BusConfig, ProdConfig } from './config';
export class AppSettings {
    public static Env: AppEnvironment = AppEnvironment.Dev;
    public static isDebugMode = true;
    public static AppName = 'seed';
    public static AppVersion = '3.0';
    public static isOktaRequired = false;
    public static AppUrl = {
        api: '/app-api/',
        // dashboardApi : '/dashboard-api/'
        dashboardApi : 'http://172.24.213.11:20203/',
    };
    public static config(): Config {
        switch (AppSettings.Env) {
            case AppEnvironment.Local:
            case AppEnvironment.Dev:
                return new DevConfig();
            case AppEnvironment.QAS:
                return new QasConfig();
            case AppEnvironment.Bus:
                return new BusConfig();
            case AppEnvironment.Prod:
                return new ProdConfig();
        }
    }
}
