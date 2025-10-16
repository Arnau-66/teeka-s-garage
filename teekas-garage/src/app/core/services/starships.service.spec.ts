import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { StarshipsService } from "./starships.service";
import { environment } from "../../../environments/environment";
import { StarshipDetailsResponse } from "../models/starships";

describe ('StarshipsService', () => {

    let service: StarshipsService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [StarshipsService]
        });

        service = TestBed.inject(StarshipsService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch starship details from primary API and map response',() => {
        const mockResponse: Partial<StarshipDetailsResponse> = {
            name: 'Death Star',
            model: 'DS-1 Orbital Battle Station',
            manufacturer: 'Imperial Department of Military Research',
            cost_in_credits: '1000000000000',
            length: '120000',
            max_atmosphering_speed: 'n/a',
            crew: '342953',
            passengers: '843342',
            cargo_capacity: '1000000000000',
            consumables: '3 years',
            hyperdrive_rating: '4.0',
            MGLT: '10',
            starship_class: 'Deep Space Mobile Battlestation',
            url: `${environment.apiPrimary}/starships/9/`
        };

    service.getStarshipDetails(9).subscribe(result => {
      expect(result.id).toBe(9);                               
      expect(result.name).toBe('Death Star');                  
      expect(result.costInCredits).toBe(1000000000000);        
      expect(result.maxAtmospheringSpeed).toBeNull();        
    });

    const req = httpMock.expectOne(`${environment.apiPrimary}/starships/9/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);    
    });
})