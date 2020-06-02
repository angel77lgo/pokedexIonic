import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PokemonService {
  baseUrl = "https://pokeapi.co/api/v2";
  imageUrl =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
  typeUrl = "https://pokeapi.co/api/v2/type";
  moveUrl = "https://pokeapi.co/api/v2/move";
  specieUrl = "https://pokeapi.co/api/v2/pokemon-species"

  constructor(private http: HttpClient) { }

  getPokemon(offset = 0) {
    return this.http.get(`${this.baseUrl}/pokemon?offset=${offset}&limit=50`).pipe(
      map((result) => {
        return result["results"];
      }),
      map((pokemons) => {
        return pokemons.map((pokemon, index) => {
          // console.log("pokemon", index)
          pokemon.image = this.getPokeImage(index + offset + 1);
          pokemon.Mytypes = [];
          this.getPokeType(index + offset + 1).then((response: any) => {
            response.map((type) => {
              pokemon.Mytypes.push(type);
            });
          });
          pokemon.pokeIndex = offset + index + 1;
          return pokemon;
        });
      })
    );
  }

  getPokeType(index) {
    let type = new Promise((resolve, reject) => {
      this.http.get(`${this.baseUrl}/pokemon/${index}`).pipe(
        map((pokemon) => {
          let t = pokemon["types"];
          let types = [];
          t.map((type) => types.push(type["type"]["name"]));
          return types;
        })
      )
        .subscribe((response) => {
          resolve(response);
        });
    });

    return type;
  }

  getPokeImage(index) {
    return `${this.imageUrl}${index}.png`;
  }

  findPokemon(search) {
    return this.http.get(`${this.baseUrl}/pokemon/${search}`).pipe(
      map((pokemon) => {
        pokemon["image"] = this.getPokeImage(pokemon["id"]);
        pokemon["pokeIndex"] = pokemon["id"];
        return pokemon;
      })
    );
  }

  getPerPart(part) {
    return this.http.get(`${this.baseUrl}/pokemon?offset=${part}&limit=886`).pipe(
      map((pokemon) => {
        let pokes = pokemon["results"];
        let names = [];
        pokes.map((p) => names.push(p["name"]));
        return names;
      })
    );
  }

  getPokeDetails(index) {
    return this.http.get(`${this.baseUrl}/pokemon/${index}`).pipe(
      map((poke) => {
        let sprites = Object.keys(poke["sprites"]);
        poke["images"] = sprites
          .map((spriteKey) => poke["sprites"][spriteKey])
          .filter((img) => img);

        poke["moveTypes"] = [];
        poke["moves"].map((move) => {
          this.getMoveType(move["move"]["name"]).then((res) => {
            let arr = {
              move: move["move"]["name"],
              type: res,
            };
            poke["moveTypes"].push(arr);
          });
        });
        poke['description'] = "";
        // console.log("specieee", poke["species"]["url"])
        this.getDescription(poke["species"]["url"]).then(resp => {
          poke['description'] = resp;
        });

        return poke;
      })
    );
  }

  getAllTypes() {
    return this.http.get(this.typeUrl).pipe(
      map((type) => {
        let a = type["results"];
        let types = [];
        a.map((t) =>
          types.push(t["name"].charAt(0).toUpperCase() + t["name"].slice(1))
        );
        return types;
      })
    );
  }

  getPokeByType(type) {
    return this.http.get(`${this.typeUrl}/${type}`).pipe(
      map((type) => {
        let pokemon = [];
        type["pokemon"].map((poke) => {
          pokemon.push(poke["pokemon"]["name"]);
        });
        return pokemon;
      })
    );
  }

  getMoveType(move) {
    let moveType = new Promise((resolve, reject) => {
      this.http.get(`${this.moveUrl}/${move}`).pipe(
        map((mov) => {
          let type = mov["type"]["name"];
          return type;
        })
      ).subscribe((response) => {
        resolve(response);
      });
    });
    return moveType;
  }

  getMove(move) {
    return this.http.get(`${this.moveUrl}/${move}`).pipe(
      map((move) => {
        return move;
      })
    );
  }

  getDescription(url) {
    let description = new Promise((resolve, reject) => {
      this.http.get(url).pipe(
        map(result => {
          let desc = ""
          result["flavor_text_entries"].map(flavors => {
            if(flavors["language"]["name"] === "en"){
              desc = flavors["flavor_text"]
            }
          });
          return desc
        })
      ).subscribe(res => {
        resolve(res)
      });
    });

    return description;
  }
}
