
import * as path from "path";

const resourcePath = "resources";
const staticPath = "static";
const resourceDir = path.join(__dirname, "..", "..",  resourcePath);
const staticDir   = path.join(__dirname, "..",  "..", staticPath);
const srcDir      = path.join(__dirname, "..",  "..", "src");

export const settings = {
    sitename: "Typed CRUD",

    resourcePath,
    staticPath,

    staticURL: {
        styles:  path.join("/", staticPath, "styles"),
        scripts: path.join("/", resourcePath, "scripts"),
        withScript(name: string) {
            if (path.isAbsolute(name))
                return name;
            return path.join(this.scripts, name);
        },
        withStyle(name: string)  {
            if (path.isAbsolute(name))
                return name;
            return path.join(this.styles, name);
        },
    },

    resourceURL: {
        styles:  path.join("/", resourcePath, "styles"),
        scripts: path.join("/", resourcePath, "scripts"),
        withScript(name: string) {
            if (path.isAbsolute(name))
                return name;
            return path.join(this.scripts, name);
        },
        withStyle(name: string)  {
            if (path.isAbsolute(name))
                return name;
            return path.join(this.styles, name);
        },
    },

    fs: {
        staticDir,
        resourceDir,
        stylesDir: path.join(resourceDir, "styles"),
        scriptsDir: path.join(resourceDir, "scripts"),


        withStaticDir(filename="") {
            return path.join(this.scriptsDir, filename);
        },
        withStylesDir(filename="") {
            return path.join(this.stylesDir, filename);
        },
    },
}

