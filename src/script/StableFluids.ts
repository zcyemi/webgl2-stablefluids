
export class StableFluids{

    private gl: WebGL2RenderingContext;

    public constructor(canvas:HTMLCanvasElement){
        
        this.gl = canvas.getContext('webgl2');

        
    }

    public onFrame(ts:number){

    }
}