import {data, details} from './data/realData';
import { Sankey } from "./sankey"

const node = document.getElementById("sankey");

const sankey = new Sankey(data, details, node);

sankey.draw();
