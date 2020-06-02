import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  details:any;
  slideOpts = {
    autoplay:{
      delay:1000,
      disableOnInteraction:false
    }
  };
  TYPE_COLORS = {
    bug: "B1C12E",
    dark: "4F3A2D",
    dragon: "755EDF",
    electric: "FCBC17",
    fairy: "F4B1F4",
    fighting: "823551D",
    fire: "E73B0C",
    flying: "A3B3F7",
    ghost: "6060B2",
    grass: "74C236",
    ground: "D3B357",
    ice: "A3E7FD",
    normal: "C8C4BC",
    poison: "934594",
    psychic: "ED4882",
    rock: "B9A156",
    steel: "B5B5C3",
    water: "3295F6",
  };

  constructor(private route:ActivatedRoute,private pokeService:PokemonService) { }

  ngOnInit() {
    let index = this.route.snapshot.paramMap.get('index')
    this.pokeService.getPokeDetails(index).subscribe(pokemon => {
      console.log("Details: ", pokemon)
      this.details = pokemon
    })
  }

}
