import React, {ReactNode, useCallback, useMemo} from 'react'
import isHotkey from 'is-hotkey'
import {Editable, withReact, useSlate, Slate} from 'slate-react'
import {
    Editor,
    Transforms,
    createEditor,
    Descendant,
    Element as SlateElement,
} from 'slate'
import Button from "../Button";
import Images from "../../assets/images";


const HOTKEYS: { [name: string]: string } = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

const initialValue = [
    {
        type: 'paragraph',
        children: [
            {text: 'This is editable '},
            {text: 'rich', bold: true},
            {text: ' text, '},
            {text: 'much', italic: true},
            {text: ' better than a '},
            {text: '<textarea>', code: true},
            {text: '!'},
        ],
    },
    {
        type: 'paragraph',
        children: [
            {
                text:
                    "Since it's rich text, you can do things like turn a selection of text ",
            },
            {text: 'bold', bold: true},
            {
                text:
                    ', or add a semantically rendered block quote in the middle of the page, like this:',
            },
        ],
    },
    {
        type: 'block-quote',
        children: [{text: 'A wise quote.'}],
    },
    {
        type: 'paragraph',
        align: 'center',
        children: [{text: 'Try it out for yourself!'}],
    },
]

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

type Props = {
    value: Descendant[]
    onChange?: (v: any) => void
}

const RichTextExample = (p: Props) => {
    const renderElement = useCallback((props: JSX.IntrinsicAttributes & { attributes: any; children: any; element: any; }) =>
        <Element {...props} />, [])
    const renderLeaf = useCallback((props: JSX.IntrinsicAttributes & { attributes: any; children: ReactNode; leaf: any; }) =>
        <Leaf {...props} />, [])
    const editor = useMemo(() => withReact(createEditor()), [])

    return (
        <Slate editor={editor} value={p.value} onChange={p.onChange}>
            <div className="d-flex flex-row justify-content-start flex-wrap">
                <MarkButton format="bold" icon={Images.richText.bold}/>
                <MarkButton format="italic" icon={Images.richText.italic}/>
                <MarkButton format="underline" icon={Images.richText.underlined}/>
                <MarkButton format="code" icon={Images.richText.code}/>
                <BlockButton format="heading-one" icon={Images.richText.looksOne}/>
                <BlockButton format="heading-two" icon={Images.richText.looksTwo}/>
                <BlockButton format="block-quote" icon={Images.richText.quote}/>
                <BlockButton format="numbered-list" icon={Images.richText.formatListNumber}/>
                <BlockButton format="bulleted-list" icon={Images.richText.formatListBullet}/>
                <BlockButton format="left" icon={Images.richText.alignLeft}/>
                <BlockButton format="center" icon={Images.richText.alignCenter}/>
                <BlockButton format="right" icon={Images.richText.alignRight}/>
                <BlockButton format="justify" icon={Images.richText.alignJustify}/>
            </div>
            <div className="border">
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Enter some rich text…"
                    spellCheck
                    autoFocus
                    onKeyDown={event => {
                        for (const hotkey in HOTKEYS) {
                            if (isHotkey(hotkey, event)) {
                                event.preventDefault()
                                const mark = HOTKEYS[hotkey]
                                toggleMark(editor, mark)
                            }
                        }
                    }}
                />
            </div>
        </Slate>
    )
}

const toggleBlock = (editor: any, format: string) => {
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
    )
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        // @ts-ignore
        match: (n: { type: string }) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type) &&
            !TEXT_ALIGN_TYPES.includes(format),
        split: true,
    })
    let newProperties: {}
    if (TEXT_ALIGN_TYPES.includes(format)) {
        newProperties = {
            align: isActive ? undefined : format,
        }
    } else {
        newProperties = {
            type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        }
    }
    Transforms.setNodes(editor, newProperties)

    if (!isActive && isList) {
        const block = {type: format, children: []}
        Transforms.wrapNodes(editor, block)
    }
}

const toggleMark = (editor: any, format: string) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

const isBlockActive = (editor: any, format: string, blockType = 'type') => {
    const {selection} = editor
    if (!selection) return false

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                // @ts-ignore
                n[blockType] === format,
        })
    )

    return !!match
}

const isMarkActive = (editor: any, format: string) => {
    const marks: any = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

type ElementProps = {
    children: ReactNode
    attributes: any
    element: {
        align: string
        type: string
        underline: string
        bold: string
    }
}

const Element = ({attributes, children, element}: ElementProps) => {
    const style = {textAlign: element.align}
    switch (element.type) {
        case 'block-quote':
            return (
                <blockquote style={style} {...attributes}>
                    {children}
                </blockquote>
            )
        case 'bulleted-list':
            return (
                <ul style={style} {...attributes}>
                    {children}
                </ul>
            )
        case 'heading-one':
            return (
                <h1 style={style} {...attributes}>
                    {children}
                </h1>
            )
        case 'heading-two':
            return (
                <h2 style={style} {...attributes}>
                    {children}
                </h2>
            )
        case 'list-item':
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            )
        case 'numbered-list':
            return (
                <ol style={style} {...attributes}>
                    {children}
                </ol>
            )
        default:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            )
    }
}

type LeafProps = {
    children: ReactNode
    attributes: any
    leaf: {
        code: string
        italic: string
        underline: string
        bold: string
    }
}

const Leaf = ({attributes, children, leaf}: LeafProps) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}

const BlockButton = ({format, icon}: { format: string, icon: ReactNode }) => {
    const editor = useSlate()
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
    )
    return (
        <Button
            className={`${isActive ? "btn-primary" : "btn-outline-primary"}`}
            // active={isBlockActive(
            //     editor,
            //     format,
            //     TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
            // )}
            onMouseDown={event => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
            style={{marginRight: 2}}
        >
            {icon}
        </Button>
    )
}

const MarkButton = ({format, icon}: { format: string, icon: ReactNode }) => {
    const editor = useSlate()
    const isActive = isMarkActive(editor, format)
    return (
        <Button
            className={`${isActive ? "btn-success" : "btn-outline-success"}`}
            // active={isMarkActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
            style={{marginRight: 2}}
        >
            {icon}
        </Button>
    )
}


export default RichTextExample
