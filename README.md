# The Forces Awakened
An entry to the Ludum Dare 34 game jam.

Fly in the Aluminium Falcon and escape the clutches of the Intergalactic Empire! 

This is my first Ludum Dare entry, a simple Asteroids style game which is in no way derivative of anything. 

Created using HTML Canvas and Javascript (no game libraries used). 

## Discussion
I was learning how a lot of JavaScript's features worked as I went with this game; as a result the code is untidy. A shortage of time means that a lot of game features are thrown together and need some refactoring.
### Possibilities for future improvement: 
- Refactoring to reduce coupling between objects.
- Improve collisions between player and other objects (currently rectangular bounding boxes only).
- Handle audio in a cleaner way.
- Improve enemy algorithms to behave more intelligently when close to the player.
- Add a victory animation.
- Test which objects are visible (released version renders everything every frame!)
- Handle the edges of the map better (draw objects on the other side of the boundary so it is seamless).
