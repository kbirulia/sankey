import {data} from './data/realBigData';
import { SankeyComponent } from "./sankey"

const node = document.getElementById("sankey");

const sankey = new SankeyComponent(data, node);

sankey.draw();
