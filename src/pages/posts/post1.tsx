
import {
    elements,
    createRouter,
    allowStr,
    Types,
    layouts,
    db,
} from "../../lib";
import {breadCrumb} from "../../views/components";

const routeInfo = {
    id: "post1",
    parentId: "posts",
    title: "Lorem Ipsum",
}

const view = () => {
    let layout = new layouts.DefaultLayout();
    layout.body = <div>
        {breadCrumb(routeInfo.id)}
        <h2>{routeInfo.title}</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at nulla bibendum sem auctor rhoncus vitae id massa. Integer quis hendrerit libero. Sed mauris sapien, venenatis nec sodales vitae, dictum ac mi. Phasellus enim enim, volutpat in enim eu, dapibus lacinia augue. Morbi pharetra magna ac ex gravida, fringilla consectetur nunc egestas. Maecenas rhoncus interdum accumsan. In vel cursus nibh. Morbi justo mi, pulvinar eu tempus ut, finibus a magna.  </p><p>

                Integer gravida sed nunc sed tristique. Ut vulputate ornare gravida. Etiam ac velit in ex euismod condimentum faucibus nec tortor. Morbi imperdiet augue at metus convallis viverra. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer lacus justo, pretium nec pellentesque non, convallis in tortor. Nullam ut fermentum arcu, ac gravida ex. Nunc felis neque, posuere et libero vehicula, fringilla suscipit dui. Nam feugiat neque purus, quis rhoncus mi blandit in. Curabitur nec mollis massa. Suspendisse vitae nisi vitae tellus posuere interdum. Donec a pretium ante. Nullam et mi tristique, pharetra augue vitae, porttitor nibh. Curabitur mollis, turpis ac scelerisque placerat, nibh libero maximus lacus, a sagittis felis eros at dui. Mauris tristique, erat sit amet tristique malesuada, odio felis faucibus urna, vel blandit elit dolor a magna. Curabitur fermentum consectetur mattis. </p><p>

    Etiam commodo sagittis viverra. Vivamus sodales magna nulla, nec volutpat ligula maximus non. Suspendisse interdum, orci id sollicitudin varius, libero velit porta magna, sed malesuada urna orci non tortor. Cras eu arcu nec mi euismod elementum et elementum urna. Mauris varius feugiat nibh, sed venenatis est auctor imperdiet. Sed mollis risus nulla, at iaculis lectus sollicitudin vitae. Mauris finibus ornare lacinia. Sed leo quam, iaculis quis mi ut, congue semper neque. Sed odio ipsum, mattis non aliquam quis, congue at nunc. </p><p>

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut risus ullamcorper, maximus ligula sit amet, luctus orci. Ut aliquam nec ante malesuada condimentum. Nulla at purus velit. Cras sit amet tortor bibendum, imperdiet nulla in, lobortis justo. Proin congue tincidunt erat, vel scelerisque enim mattis non. Nam non nisl at mauris sagittis luctus. Vivamus finibus tincidunt lorem, id rutrum dolor rutrum eleifend. Aenean tristique sollicitudin mauris in lobortis. Nunc turpis ipsum, rutrum at venenatis luctus, tempus a sapien. Etiam porta tellus nisl, eu molestie tellus rhoncus ac. </p><p>

    Quisque eget purus finibus erat tincidunt tristique at ut urna. Vivamus ac leo ut metus vulputate consectetur. Praesent eget ante eros. Suspendisse potenti. Nam pulvinar suscipit lorem. In quis convallis nulla, eu viverra nisi. Etiam viverra consectetur lacus aliquam pretium. Sed ullamcorper finibus odio. Cras gravida id metus at hendrerit.
            </p>
    </div>

    return layout.render();
}

const handler = async (request: Types.Request, response: Types.Response) => {
    response.send(view());
}

export {handler, routeInfo};
