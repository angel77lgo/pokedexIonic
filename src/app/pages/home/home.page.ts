import { Component, OnInit, ViewChild } from "@angular/core";
import { PokemonService } from "../../services/pokemon.service";
import { IonInfiniteScroll } from "@ionic/angular";
import { rejects, equal } from 'assert';
import { async } from '@angular/core/testing';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  offset = 0;
  pokemon = [];
  names = [];
  types = [];

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

  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  constructor(private pokeService: PokemonService) { }

  ngOnInit() {
    this.loadPokemon();
    this.pokeService.getPerPart(0).subscribe(res => this.names = res)
    this.loadTypes();
  }

  loadTypes() {
    this.pokeService.getAllTypes().subscribe(res => {
      console.log("types ", res)
      this.types = res;
    })
  }

  loadPokemon(loadMore = false, event?) {
    this.pokemon = []
    if (loadMore) {
      this.offset += 25;
    }
    console.log("offset ", this.offset);

    this.pokeService.getPokemon(this.offset).subscribe((response) => {
      console.log("result: ", response);

      this.pokemon = [...this.pokemon, ...response];

      if (event) {
        event.target.complete();
      }

      if (this.offset == 125) {
        this.infinite.disabled = true;
      }
    });
  }

  async onSearchChange(e) {
    let value = e.detail.value;
    let part = 0;

    console.log('length ', value.length)

    console.log(`value -> ${value}`)

    let equalsName = []

    this.names.map((names: String) => {
      let valueLength = value.length;
      let newname = names.substring(0, valueLength)
      if (newname === value) {
        equalsName.push(names)
      }
    });

    console.log("equals name ", equalsName)

    let pokemonData = []
    if (value.length == 0) {
      this.offset = 0;
      this.loadPokemon();
      return;
    }

    equalsName.map(pokename => {

      this.pokeService.findPokemon(pokename).subscribe(res => {

        res['Mytypes'] = []
        res['types'].map(type => {
          res['Mytypes'].push(type['type']['name']);
        });

        pokemonData.push(res);
      });
    });
    console.log("pokemonData ", pokemonData);
    this.pokemon = pokemonData;


  }

  async changeType(e) {
    console.log("event ", e.target.value)
    let type = e.target.value
    let matchType = []
    let pokes = [];

    this.pokeService.getPokeByType(type).subscribe(async (response) => {
      for (let name of response) {
        // let res = await new Promise((resolve,reject) => this.pokeService.findPokemon(name).subscribe(resp => resolve(resp)));
        new Promise((resolve, reject) =>

          this.pokeService.findPokemon(name).subscribe(res =>
            
            resolve(res))).then(res => {
              
              res['Mytypes'] = []
              res['types'].map(type => {
                res['Mytypes'].push(type['type']['name'])
              })
              matchType.push(res)
            }).
            catch(err => console.log("err"))
      }
    })

    console.log(pokes)

    console.log("matchType ", matchType)
    this.pokemon = matchType

  }


}
