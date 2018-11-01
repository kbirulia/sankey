import {data} from './data/data';
import { SankeyComponent } from "./sankey"

const node = document.getElementById("sankey");

const sankey = new SankeyComponent(data, node);

sankey.draw();
