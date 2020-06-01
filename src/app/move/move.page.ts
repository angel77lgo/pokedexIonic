import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-move',
  templateUrl: './move.page.html',
  styleUrls: ['./move.page.scss'],
})
export class MovePage implements OnInit {

  move:any
  pokes:any
  
  constructor(private route:ActivatedRoute,private pokeService:PokemonService) { }

  async ngOnInit() {
    let move = this.route.snapshot.paramMap.get('move')
    
    console.log("move -> ", move)
    this.pokes = await new Promise((resolve,reject) => this.pokeService.getPerPart(0).subscribe(res => resolve(res)))

    this.pokeService.getMove(move).subscribe(response => {
      console.log("response ",response)
      this.move = response
    })

  

    
  }

  

  
}
