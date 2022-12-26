import { Tab } from "@headlessui/react"
import Selector from "./Selector"

const Switcher = () => {
  return (
    <>
      <Tab.Group>
        {({ selectedIndex }) => (
          <>
            <Tab.List className="flex items-center">
              <div
                className="w-full flex space-x-1 rounded-lg bg-slate-100 p-0.5"
                role="tablist"
                aria-orientation="horizontal"
              >
                <Tab
                  className="flex items-center rounded-lg py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3 bg-white shadow"
                  id="id"
                  role="tab"
                  type="button"
                  aria-selected="true"
                  data-headlessui-state="selected"
                  aria-controls="id"
                >
                  Fixed
                </Tab>
                <Tab
                  className="flex items-center rounded-lg py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3 bg-white shadow"
                  id="id"
                  role="tab"
                  type="button"
                  aria-selected="false"
                  data-headlessui-state="selected"
                  aria-controls="id"
                >
                  Percentage
                </Tab>
              </div>
              {selectedIndex === 0 ? <></> : null}
            </Tab.List>
            <Tab.Panels className="-mt-4">
              <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                <Selector value="20 INR" underValue="Spot Price" />
              </Tab.Panel>
              <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                <Selector value="100%" underValue="" />
              </Tab.Panel>
            </Tab.Panels>
          </>
        )}
      </Tab.Group>
    </>
  )
}

export default Switcher
