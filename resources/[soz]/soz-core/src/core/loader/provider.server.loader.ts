import { Injectable } from '../decorators/injectable';
import { ProviderLoader } from './provider.loader';

@Injectable(ProviderLoader)
export class ProviderServerLoader extends ProviderLoader {}
