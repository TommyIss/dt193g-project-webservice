import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnApplicationBootstrap {
    constructor(private readonly dataSource: DataSource) {}

    async onApplicationBootstrap() {
        try {
            if(this.dataSource.isInitialized) {
                console.log('Ansluten till databas!');
            } else {
                console.log('Databas är inte initierad än!');
            }
        } catch (error) {
            console.error('Anslutning till databas misslyckades: ', error);
            process.exit(1);
        }
    }
}
